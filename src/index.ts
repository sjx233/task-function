import { MinecraftFunction, Pack } from "minecraft-packs";
import ResourceLocation = require("resource-location");

export class Task {
  private readonly commands: string[] = [];
  public readonly functionId: ResourceLocation;

  public constructor(public readonly group: TaskGroup, public readonly id: number) {
    this.functionId = new ResourceLocation("taskfunction", `${group.name}/${id}`);
  }

  public thenRun(task: Task | ResourceLocation, time?: number): this;
  public thenRun(command: string): this;
  public thenRun(task: Task | ResourceLocation | string, time = 0): this {
    if (typeof task === "string") this.commands.push(task);
    else {
      const functionId = task instanceof ResourceLocation ? task.toString() : task.functionId;
      this.commands.push((time = Math.round(time)) > 0 ? `schedule function ${functionId} ${time} append` : `function ${functionId}`);
    }
    return this;
  }

  public addTo(pack: Pack): void {
    pack.addResource(new MinecraftFunction(this.functionId, this.commands));
  }
}

export class TaskGroup {
  private readonly tasks: Task[] = [];

  public constructor(public readonly name: string) {
    if (!/^[a-z0-9/_.-]*$/.test(name)) throw new SyntaxError("Invalid name: non [a-z0-9/_.-] character");
  }

  public getTasks(): Task[] {
    return Array.from(this.tasks);
  }

  public taskCount(): number {
    return this.tasks.length;
  }

  public newTask(): Task {
    const tasks = this.tasks;
    const task = new Task(this, tasks.length);
    tasks.push(task);
    return task;
  }

  public addTo(pack: Pack): void {
    for (const task of this.tasks)
      task.addTo(pack);
  }
}
