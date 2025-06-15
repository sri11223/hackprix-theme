const fs = require('fs').promises;
const path = require('path');

class JsonDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.cache = new Map();
  }

  async readJsonFile(filename) {
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    const filePath = path.join(this.dataDir, filename);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(data);
      this.cache.set(filename, jsonData);
      return jsonData;
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      throw error;
    }
  }

  async writeJsonFile(filename, data) {
    const filePath = path.join(this.dataDir, filename);
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      this.cache.set(filename, data);
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      throw error;
    }
  }

  // Jobs
  async getJobs() {
    const data = await this.readJsonFile('jobs.json');
    return data.jobs;
  }

  async addJob(job) {
    const data = await this.readJsonFile('jobs.json');
    data.jobs.push(job);
    await this.writeJsonFile('jobs.json', data);
    return job;
  }

  async updateJob(jobId, updates) {
    const data = await this.readJsonFile('jobs.json');
    const index = data.jobs.findIndex(job => job.id === jobId);
    if (index === -1) throw new Error('Job not found');
    
    data.jobs[index] = { ...data.jobs[index], ...updates };
    await this.writeJsonFile('jobs.json', data);
    return data.jobs[index];
  }

  // Users
  async getUser(userId) {
    const data = await this.readJsonFile('users.json');
    return data.users.find(user => user.id === userId);
  }

  async updateUser(userId, updates) {
    const data = await this.readJsonFile('users.json');
    const index = data.users.findIndex(user => user.id === userId);
    if (index === -1) throw new Error('User not found');
    
    data.users[index] = { ...data.users[index], ...updates };
    await this.writeJsonFile('users.json', data);
    return data.users[index];
  }

  // Messages
  async getMessages(userId) {
    const data = await this.readJsonFile('messages.json');
    return data.messages.filter(msg => 
      msg.from === userId || msg.to === userId
    );
  }

  async addMessage(message) {
    const data = await this.readJsonFile('messages.json');
    data.messages.push(message);
    await this.writeJsonFile('messages.json', data);
    return message;
  }

  // Helper method to generate unique IDs
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = new JsonDatabase();
