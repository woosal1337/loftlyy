import { CliError } from "@/cli/core/errors"

export const toMcpError = (error: unknown) => {
  const message =
    error instanceof CliError
      ? error.message
      : error instanceof Error
        ? error.message
        : "An unexpected error occurred"

  return {
    content: [{ type: "text" as const, text: message }],
    isError: true as const,
  }
}
