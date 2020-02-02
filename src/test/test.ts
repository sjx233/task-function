import { DataPack } from "minecraft-packs";
import { TaskGroup } from "../index";

const pack = new DataPack("test data pack");
const taskGroup = new TaskGroup("taskfunction:test");
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
  .thenRun(task1, 8)
  .thenRun("tellraw @a \"Task 3 Test 3\"");
taskGroup.addTo(pack);
pack.write("test");
