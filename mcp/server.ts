import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { registerPrompts } from "./prompts.js"
import { registerResources } from "./resources.js"
import { registerTools } from "./tools.js"

export const server = new McpServer({
  name: "loftlyy",
  version: "0.1.0",
})

registerTools(server)
registerResources(server)
registerPrompts(server)
