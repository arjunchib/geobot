import {
  InteractionResponseType,
  APIApplicationCommandInteraction,
  ApplicationCommandType,
  APIInteractionResponse,
} from "../deps.ts";
import { RenderState } from "../structures/RenderState.ts";
import { CommandState } from "../structures/CommandState.ts";
import { Context } from "../structures/Context.ts";

export async function onApplicationCommand(
  interaction: APIApplicationCommandInteraction,
  ctx: Context
): Promise<APIInteractionResponse> {
  if (interaction.data.type === ApplicationCommandType.ChatInput) {
    const command = ctx.commands.find((c) => c.name === interaction.data.name)!;
    const rs = new RenderState();
    rs.inputs.clear();
    rs.store.clear();
    interaction.data.options?.forEach((opt) => rs.inputs.set(opt.name, opt));
    rs.mode = "input1";
    rs.runCommand(command);
    rs.hash = await CommandState.set({
      name: command.name,
      inputs: [...rs.inputs],
      store: [...rs.store],
    });
    rs.mode = "input2";
    rs.buttonCount = 0;
    const data = rs.runCommand(command);
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data,
    };
  }
  throw new Error("Invalid request");
}
