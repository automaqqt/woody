import fs from 'fs';
import { Course } from '../interfaces/training';
import { Score, User } from '../interfaces/user';
// users in JSON file for simplicity, store in a db for production applications
let users: User[] = require('../data/users.json');
const chapters: Course[] = require('../data/training.json');
const scores: Score[] = require('../data/scores.json');

export const usersRepo = {
  getAll: () => users,
  getById: (id: number) => users.find((x) => x.id.toString() === id.toString()),
  find: (x: any): User | undefined => users.find(x),
  delete: _delete
};

export const woodRepo = {
  getAll: () => chapters,
  getById: (id:number) => chapters.find((x) => x.id.toString() === id.toString()),
  find: (x:any ): Course | undefined => chapters.find(x)
};

export const scoresRepo = {
  getAll: () => scores,
  getById: (id:number) => scores.find((x) => x.id.toString() === id.toString()),
  find: (x:any ): Score | undefined => scores.find(x),
  update,
  create,
  add
};

function update(id: string, params: Score): boolean {
  const score = scores.find((x) => x.id.toString() === id.toString());

  // update and save
  if (score) {
    Object.assign(score, params);
    saveData();
    return true
  }
  return false
  
}

function create(score: Score): Score {
  // generate new user id

  score.id = scores.length ? Math.max(...scores.map((x) => x.id)) + 1 : 1;
  // add and save score
  scores.push(score);
  saveData();
  return score;
}

function add(score: Score): Score {
  
  // add and save score
  scores.push(score);
  saveData();
  return score;
}

function _delete(id: number) {
  // filter out deleted user and save
  users = users.filter((x) => x.id.toString() !== id.toString());
  saveData();
}

function saveData() {
  fs.writeFileSync(
    process.cwd() + '/src/data/scores.json',
    JSON.stringify(scores, null, 4)
  );
}
