import { Pack, PackType } from "minecraft-packs";
import { TaskGroup } from "../index";

const pack = new Pack(PackType.DATA_PACK, "Test datapack.");
const taskGroup = new TaskGroup("group");
const task1 = taskGroup.newTask()
  .thenRun("tellraw @a \"Task 1 Test 1\"")
  .thenRun("tellraw @a \"Task 1 Test 2\"")
  .thenRun("tellraw @a \"Task 1 Test 3\"");
const task2 = taskGroup.newTask()
  .thenRun("tellraw @a \"Task 2 Test 1\"")
  .thenRun(task1, 4)
  .thenRun(task1, 6)
  .thenRun("tellraw @a \"Task 2 Test 2\"")
  .thenRun("tellraw @a \"Task 2 Test 3\"")
  .thenRun(task1);
taskGroup.newTask()
  .thenRun("tellraw @a \"Task 3 Test 1\"")
  .thenRun("tellraw @a \"Task 3 Test 2\"")
  .thenRun(task2, 0)
  .thenRun(task2, 8)
  .thenRun("tellraw @a \"Task 3 Test 3\"");
taskGroup.addTo(pack);
pack.write("test");
