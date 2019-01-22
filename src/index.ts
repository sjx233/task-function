import { MinecraftFunction, Pack, PackType } from "minecraft-packs";
import ResourceLocation from "resource-location";
import { asyncMap } from "./utils";

export class TaskGroup {
  private readonly tasks: Task[] = [];

  public constructor(public readonly name: string) {
    if (!/^[a-z0-9/_.-]*$/.test(name)) throw new SyntaxError("Invalid name: non [a-z0-9/_.-] character");
  }

  public getTasks() {
    return Array.from(this.tasks);
  }

  public taskCount() {
    return this.tasks.length;
  }

  public newTask() {
    const tasks = this.tasks;
    const task = new Task(this, tasks.length);
    tasks.push(task);
    return task;
  }

  public async addTo(pack: Pack, addCallback?: (task: Task) => void) {
    if (pack.type !== PackType.DATA_PACK) throw new TypeError("Adding task group to pack of wrong type");
    await this.addToUnchecked(pack, addCallback);
  }

  public async addToUnchecked(pack: Pack, addCallback?: (task: Task) => void) {
    await Promise.all(await asyncMap(this.tasks, addCallback ? task => task.addToUnchecked(pack).then(() => addCallback(task)) : task => task.addToUnchecked(pack)));
  }
}

export class Task {
  private readonly commands: string[] = [];
  private readonly references: TaskReference[] = [];
  public readonly functionId: ResourceLocation;

  public constructor(public readonly group: TaskGroup, public readonly id: number) {
    this.functionId = new ResourceLocation("taskfunction", `tasks/${group.name}/${id}`);
  }

  public then(task: Task, time?: number): this;
  public then(command: string): this;
  public then(arg1: Task | string, arg2?: number) {
    this.commands.push(arg1 instanceof Task ? arg2 && (arg2 = Math.round(arg2)) > 0 ? `schedule function ${arg1.newReference().functionId} ${arg2}` : `function ${arg1.functionId}` : arg1);
    return this;
  }

  public getReferences() {
    return Array.from(this.references);
  }

  public referenceCount() {
    return this.references.length;
  }

  public newReference() {
    const references = this.references;
    const reference = new TaskReference(this, references.length);
    references.push(reference);
    return reference;
  }

  public async addTo(pack: Pack) {
    if (pack.type !== PackType.DATA_PACK) throw new TypeError("Adding task to pack of wrong type");
    await this.addToUnchecked(pack);
  }

  public async addToUnchecked(pack: Pack) {
    pack.addResource(this.toMinecraftFunction());
    await Promise.all(await asyncMap(this.references, reference => reference.addToUnchecked(pack)));
  }

  public toMinecraftFunction() {
    return new MinecraftFunction(this.functionId, this.commands);
  }
}

export class TaskReference {
  public readonly functionId: ResourceLocation;

  public constructor(public readonly task: Task, public readonly id: number) {
    this.functionId = new ResourceLocation("taskfunction", `refs/${task.group.name}/${task.id}/${id}`);
  }

  public async addTo(pack: Pack) {
    if (pack.type !== PackType.DATA_PACK) throw new TypeError("Adding task reference to pack of wrong type");
    await this.addToUnchecked(pack);
  }

  public async addToUnchecked(pack: Pack) {
    pack.addResource(new MinecraftFunction(this.functionId, [`function ${this.task.functionId}`]));
  }
}
