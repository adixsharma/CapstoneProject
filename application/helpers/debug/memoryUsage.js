function logMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    console.log(`Memory Usage: 
  RSS: ${memoryUsage.rss} bytes
  Heap Total: ${memoryUsage.heapTotal} bytes
  Heap Used: ${memoryUsage.heapUsed} bytes
  External: ${memoryUsage.external} bytes`);
}

module.exports = logMemoryUsage;