import { deploymentValidator } from "../src/lib/validation/deployment-validation";
import { logger } from "../src/lib/environment/production-logging";

async function runProductionTests() {
  console.log("========================================");
  console.log("PRODUCTION TESTING - HANDYVERTRAG.APP");
  console.log("========================================");
  console.log("");

  // Test 1: Build Validation
  console.log("Test 1: Build Validation...");
  try {
    const buildResult = await deploymentValidator.validateBuild();
    console.log(`Build Success: ${buildResult.buildSuccess}`);
    console.log(`Build Time: ${buildResult.buildTime}ms`);
    console.log(`Bundle Size: ${buildResult.bundleSize} bytes`);
    console.log(`Valid: ${buildResult.valid}`);
    if (buildResult.errors.length > 0) {
      console.log("Errors:", buildResult.errors);
    }
    if (buildResult.warnings.length > 0) {
      console.log("Warnings:", buildResult.warnings);
    }
  } catch (error) {
    console.error("Build Validation Failed:", error);
  }
  console.log("");

  // Test 2: API Validation
  console.log("Test 2: API Validation...");
  try {
    const apiResult = await deploymentValidator.validateAPIRoutes();
    console.log(`API Routes: ${apiResult.apiRoutes.length}`);
    console.log(`Healthy Routes: ${apiResult.healthyRoutes.length}`);
    console.log(`Unhealthy Routes: ${apiResult.unhealthyRoutes.length}`);
    console.log(`Valid: ${apiResult.valid}`);
    if (apiResult.errors.length > 0) {
      console.log("Errors:", apiResult.errors);
    }
    if (apiResult.warnings.length > 0) {
      console.log("Warnings:", apiResult.warnings);
    }
  } catch (error) {
    console.error("API Validation Failed:", error);
  }
  console.log("");

  // Test 3: Route Validation
  console.log("Test 3: Route Validation...");
  try {
    const routeResult = await deploymentValidator.validateRoutes();
    console.log(`Routes: ${routeResult.routes.length}`);
    console.log(`Valid Routes: ${routeResult.validRoutes.length}`);
    console.log(`Invalid Routes: ${routeResult.invalidRoutes.length}`);
    console.log(`Valid: ${routeResult.valid}`);
    if (routeResult.errors.length > 0) {
      console.log("Errors:", routeResult.errors);
    }
    if (routeResult.warnings.length > 0) {
      console.log("Warnings:", routeResult.warnings);
    }
  } catch (error) {
    console.error("Route Validation Failed:", error);
  }
  console.log("");

  // Test 4: Hydration Validation
  console.log("Test 4: Hydration Validation...");
  try {
    const hydrationResult = await deploymentValidator.validateHydration();
    console.log(`Hydration Success: ${hydrationResult.hydrationSuccess}`);
    console.log(`Hydration Errors: ${hydrationResult.hydrationErrors.length}`);
    console.log(`Valid: ${hydrationResult.valid}`);
    if (hydrationResult.errors.length > 0) {
      console.log("Errors:", hydrationResult.errors);
    }
    if (hydrationResult.warnings.length > 0) {
      console.log("Warnings:", hydrationResult.warnings);
    }
  } catch (error) {
    console.error("Hydration Validation Failed:", error);
  }
  console.log("");

  // Test 5: Environment Validation
  console.log("Test 5: Environment Validation...");
  try {
    const environmentResult = await deploymentValidator.validateEnvironment();
    console.log(`Environment Variables: ${environmentResult.environmentVariables.length}`);
    console.log(`Missing Variables: ${environmentResult.missingVariables.length}`);
    console.log(`Invalid Variables: ${environmentResult.invalidVariables.length}`);
    console.log(`Valid: ${environmentResult.valid}`);
    if (environmentResult.errors.length > 0) {
      console.log("Errors:", environmentResult.errors);
    }
    if (environmentResult.warnings.length > 0) {
      console.log("Warnings:", environmentResult.warnings);
    }
  } catch (error) {
    console.error("Environment Validation Failed:", error);
  }
  console.log("");

  // Test 6: Bundle Validation
  console.log("Test 6: Bundle Validation...");
  try {
    const bundleResult = await deploymentValidator.validateBundle();
    console.log(`Bundle Size: ${bundleResult.bundleSize} bytes`);
    console.log(`Chunk Count: ${bundleResult.chunkCount}`);
    console.log(`Oversized Chunks: ${bundleResult.oversizedChunks.length}`);
    console.log(`Valid: ${bundleResult.valid}`);
    if (bundleResult.errors.length > 0) {
      console.log("Errors:", bundleResult.errors);
    }
    if (bundleResult.warnings.length > 0) {
      console.log("Warnings:", bundleResult.warnings);
    }
  } catch (error) {
    console.error("Bundle Validation Failed:", error);
  }
  console.log("");

  // Test 7: Overall Validation
  console.log("Test 7: Overall Validation...");
  try {
    const overallResult = await deploymentValidator.runAllValidations();
    console.log(`Overall Valid: ${overallResult.overallValid}`);
    console.log(`Build Valid: ${overallResult.build.valid}`);
    console.log(`API Valid: ${overallResult.api.valid}`);
    console.log(`Routes Valid: ${overallResult.routes.valid}`);
    console.log(`Hydration Valid: ${overallResult.hydration.valid}`);
    console.log(`Environment Valid: ${overallResult.environment.valid}`);
    console.log(`Bundle Valid: ${overallResult.bundle.valid}`);
    console.log("");

    if (!overallResult.overallValid) {
      console.log("========================================");
      console.log("PRODUCTION TESTS FAILED");
      console.log("========================================");
      process.exit(1);
    }
  } catch (error) {
    console.error("Overall Validation Failed:", error);
    process.exit(1);
  }

  console.log("========================================");
  console.log("PRODUCTION TESTS PASSED");
  console.log("========================================");
}

// Run production tests
runProductionTests()
  .then(() => {
    console.log("Production Testing Completed Successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Production Testing Failed:", error);
    process.exit(1);
  });
