const {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  getAllUsers,
  updateUser,
} = require("../repository/user.repository");
const { getWelcomeOtpEmail } = require("../constants/emailTemplates");
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

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

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

  const otp = generateOtp();
  await queueEmail({
    email: user.email,
    subject: EMAIL_SUBJECTS.WELCOME_OTP,
    message: getWelcomeOtpEmail({ name, otp }),
  });

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

    return buildAuthPayload(googleUser);
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    await updateUser(existingUser, {
      googleId,
      avatar: avatar || existingUser.avatar,
    });

    return buildAuthPayload(existingUser);
  }

  const user = await createUser({
    name: getGoogleProfileName(profile),
    email,
    password: null,
    googleId,
    avatar,
    authProvider: "google",
  });

  await delCache("analytics:stats");

  return buildAuthPayload(user);
};

const getCurrentUserService = (user) => buildAuthPayload(user);

const getAllUsersService = () => getAllUsers();

module.exports = {
  getCurrentUserService,
  getOrCreateGoogleUserService,
  registerUserService,
  loginUserService,
  getAllUsersService,
};
