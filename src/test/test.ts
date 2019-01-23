import { Pack, PackType } from "minecraft-packs";
import { TaskGroup } from "../index";

const pack = new Pack(PackType.DATA_PACK, "Test datapack.");
const taskGroup = new TaskGroup("group");
const task1 = taskGroup.newTask()
  .then("tellraw @a \"Task 1 Test 1\"")
  .then("tellraw @a \"Task 1 Test 2\"")
  .then("tellraw @a \"Task 1 Test 3\"");
const task2 = taskGroup.newTask()
  .then("tellraw @a \"Task 2 Test 1\"")
  .then(task1, 4)
  .then(task1, 6)
  .then("tellraw @a \"Task 2 Test 2\"")
  .then("tellraw @a \"Task 2 Test 3\"")
  .then(task1);
taskGroup.newTask()
  .then("tellraw @a \"Task 3 Test 1\"")
  .then("tellraw @a \"Task 3 Test 2\"")
  .then(task2, 0)
  .then(task2, 8)
  .then("tellraw @a \"Task 3 Test 3\"");
taskGroup.addTo(pack);
pack.write("test");
