const fs = require("fs");
const path = require("path");
const YAML = require("yamljs");
const logger = require("../config/logger");

/**
 * Loads and merges all modular Swagger/OpenAPI YAML specifications
 * in the current directory into a unified specification object.
 *
 * @returns {object} The merged OpenAPI specification object.
 */
const getSwaggerSpec = () => {
  const baseSpecPath = path.join(__dirname, "swagger.yaml");
  if (!fs.existsSync(baseSpecPath)) {
    throw new Error("Base Swagger configuration (swagger.yaml) not found.");
  }

  // Load the base spec metadata (info, servers, etc.)
  const mainSpec = YAML.load(baseSpecPath);

  // Initialize paths and components to prevent undefined access
  mainSpec.paths = mainSpec.paths || {};
  mainSpec.components = mainSpec.components || {};
  mainSpec.components.schemas = mainSpec.components.schemas || {};

  // Dynamically set backend URL from environment config
  const serverUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
  mainSpec.servers = [{ url: serverUrl, description: "Dynamic API Server" }];

  // Automatically scan and load other YAML files in this directory
  const files = fs.readdirSync(__dirname);

  files.forEach((file) => {
    // Only parse additional YAML/YML files (skipping the base swagger.yaml itself)
    if ((file.endsWith(".yaml") || file.endsWith(".yml")) && file !== "swagger.yaml") {
      try {
        const filePath = path.join(__dirname, file);
        const moduleSpec = YAML.load(filePath);

        if (moduleSpec) {
          // Merge paths
          if (moduleSpec.paths) {
            mainSpec.paths = {
              ...mainSpec.paths,
              ...moduleSpec.paths,
            };
          }

          // Merge components schemas
          if (moduleSpec.components && moduleSpec.components.schemas) {
            mainSpec.components.schemas = {
              ...mainSpec.components.schemas,
              ...moduleSpec.components.schemas,
            };
          }
        }
      } catch (error) {
        logger.error(`[Swagger Error] Failed to load spec file: ${file}`, error);
      }
    }
  });

  return mainSpec;
};

module.exports = getSwaggerSpec();
