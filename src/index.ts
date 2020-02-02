import { DataPack } from "minecraft-packs";
import ResourceLocation = require("resource-location");

export class Task {
  private readonly commands: string[] = [];
  public readonly id: ResourceLocation;

  public constructor(id: string | ResourceLocation) {
    this.id = ResourceLocation.from(id);
  }

  public thenRun(task: Task | ResourceLocation, time?: number): this;
  public thenRun(command: string): this;
  public thenRun(task: Task | ResourceLocation | string, time = 0): this {
    if (typeof task === "string") {
      this.commands.push(task);
      return this;
    }
    if (task instanceof Task) task = task.id;
    time = Math.round(time);
    this.commands.push(time > 0 ? `schedule function ${task} ${time} append` : `function ${task}`);
    return this;
  }

  public addTo(pack: DataPack): void {
    pack.functions.set(this.id, Array.from(this.commands));
  }
}

export class TaskGroup {
  private readonly tasks: Task[] = [];
  public readonly id: ResourceLocation;

  public constructor(id: string | ResourceLocation) {
    id = ResourceLocation.from(id);
    this.id = ["", "/"].includes(id.path.slice(-1)) ? id : new ResourceLocation(id.namespace, id.path + "/");
  }

  public newTask(): Task {
    const task = new Task(new ResourceLocation(this.id.namespace, this.id.path + this.tasks.length));
    this.tasks.push(task);
    return task;
  }

  public addTo(pack: DataPack): void {
    for (const task of this.tasks)
      task.addTo(pack);
  }
}
