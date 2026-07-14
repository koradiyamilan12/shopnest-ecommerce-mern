const {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  getAllUsers,
  updateUser,
  deleteUser,
  findUserByIdWithoutPassword,
} = require("../repository/user.repository");
const { getWelcomeEmail } = require("../constants/emailTemplates");
const {
  EMAIL_SUBJECTS,
  ERROR_MESSAGES,
} = require("../constants/messages");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { generateToken } = require("../utils/jwt");
const { queueEmail } = require("../queues/email.queue");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { delCache } = require("../utils/redisCache");
 
const buildAuthPayload = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  authProvider: user.authProvider,
  role: user.role,
  token: generateToken(
    { id: user.id },
    { expiresIn: process.env.JWT_EXPIRES_IN || "30d" },
  ),
});
 
const registerUserService = async ({ name, email, password }) => {
  const userExists = await findUserByEmail(email);
  if (userExists) {
    throw new BadRequestError(ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }
 
  const user = await createUser({
    name,
    email,
    password: await hashPassword(password),
  });
 
  if (!user) {
    throw new BadRequestError(ERROR_MESSAGES.INVALID_USER_DATA);
  }
 
  await delCache("analytics:stats");
 
  return buildAuthPayload(user);
};

const loginUserService = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  const isPasswordValid = user?.password
    ? await comparePassword(password, user.password)
    : false;

  if (!user || !isPasswordValid) {
    throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  if (!user.isWelcomeSent) {
    await queueEmail({
      email: user.email,
      subject: EMAIL_SUBJECTS.WELCOME,
      message: getWelcomeEmail({ name: user.name }),
    });
    await updateUser(user, { isWelcomeSent: true });
  }

  return buildAuthPayload(user);
};

const getGoogleProfileEmail = (profile) =>
  profile.emails?.find((email) => email.verified)?.value ||
  profile.emails?.[0]?.value;

const getGoogleProfileName = (profile) => {
  const fallbackName = getGoogleProfileEmail(profile)?.split("@")[0];
  return profile.displayName || fallbackName || "Google User";
};

const getGoogleProfileAvatar = (profile) => profile.photos?.[0]?.value || null;

const getOrCreateGoogleUserService = async (profile) => {
  const googleId = profile.id;
  const email = getGoogleProfileEmail(profile);

  if (!googleId || !email) {
    throw new BadRequestError(ERROR_MESSAGES.INVALID_USER_DATA);
  }

  const avatar = getGoogleProfileAvatar(profile);
  const googleUser = await findUserByGoogleId(googleId);

  if (googleUser) {
    if (avatar && avatar !== googleUser.avatar) {
      await updateUser(googleUser, { avatar });
    }

    if (!googleUser.isWelcomeSent) {
      await queueEmail({
        email: googleUser.email,
        subject: EMAIL_SUBJECTS.WELCOME,
        message: getWelcomeEmail({ name: googleUser.name }),
      });
      await updateUser(googleUser, { isWelcomeSent: true });
    }

    return buildAuthPayload(googleUser);
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    await updateUser(existingUser, {
      googleId,
      avatar: avatar || existingUser.avatar,
    });

    if (!existingUser.isWelcomeSent) {
      await queueEmail({
        email: existingUser.email,
        subject: EMAIL_SUBJECTS.WELCOME,
        message: getWelcomeEmail({ name: existingUser.name }),
      });
      await updateUser(existingUser, { isWelcomeSent: true });
    }

    return buildAuthPayload(existingUser);
  }

  const user = await createUser({
    name: getGoogleProfileName(profile),
    email,
    password: null,
    googleId,
    avatar,
    authProvider: "google",
    isWelcomeSent: true,
  });

  await delCache("analytics:stats");

  await queueEmail({
    email: user.email,
    subject: EMAIL_SUBJECTS.WELCOME,
    message: getWelcomeEmail({ name: user.name }),
  });

  return buildAuthPayload(user);
};

const getCurrentUserService = (user) => buildAuthPayload(user);

const updateCurrentUserService = async (user, { name, email, password }) => {
  const updates = {};
  if (name) updates.name = name;
  if (email) {
    const existingUser = await findUserByEmail(email);
    if (existingUser && existingUser.id !== user.id) {
      throw new BadRequestError(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }
    updates.email = email;
  }
  if (password) updates.password = await hashPassword(password);

  const updatedUser = await updateUser(user, updates);
  
  await delCache("analytics:stats");

  return buildAuthPayload(updatedUser);
};

const deleteCurrentUserService = async (user) => {
  await deleteUser(user);
  await delCache("analytics:stats");
};

const getAllUsersService = () => getAllUsers();

const adminDeleteUserService = async (id) => {
  const user = await findUserByIdWithoutPassword(id);
  if (!user) {
    throw new BadRequestError(ERROR_MESSAGES.USER_NOT_FOUND || "User not found");
  }
  await deleteUser(user);
  await delCache("analytics:stats");
};

module.exports = {
  getCurrentUserService,
  updateCurrentUserService,
  deleteCurrentUserService,
  getOrCreateGoogleUserService,
  registerUserService,
  loginUserService,
  getAllUsersService,
  adminDeleteUserService,
};
