import { logger } from "../loggers/logger";

type RetryOptions = {
  maxRetries?: number;
  delay?: number;
};

export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T | boolean>{
  const { maxRetries = 5, delay = 500 } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
        const result = await operation();

        if (result && typeof result === "object" && "success" in result && result.success === false) {
            logger.info(`Attempt ${attempt} failed (success: false). Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return false
        }else{
            return result
        }
    } catch (error) {
      if (attempt < maxRetries) {
        logger.error(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error("Operation failed after maximum retries");
}
