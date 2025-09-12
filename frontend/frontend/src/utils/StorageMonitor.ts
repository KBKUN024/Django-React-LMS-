import { indexedDBStorage } from './IndexedDBStorage';

/**
 * 存储监控和故障恢复工具
 */
export class StorageMonitor {
  private static checkInterval: number | null = null;
  private static readonly CHECK_INTERVAL_MS = 30 * 1000; // 30秒检查一次
  
  /**
   * 开始监控存储状态
   */
  static startMonitoring(): void {
    if (this.checkInterval) return; // 避免重复启动
    
    console.log('启动存储监控...');
    
    this.checkInterval = window.setInterval(async () => {
      try {
        await this.checkStorageHealth();
      } catch (error) {
        console.error('存储健康检查失败:', error);
      }
    }, this.CHECK_INTERVAL_MS);
    
    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
      this.stopMonitoring();
    });
  }
  
  /**
   * 停止监控
   */
  static stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('存储监控已停止');
    }
  }
  
  /**
   * 检查存储健康状态
   */
  private static async checkStorageHealth(): Promise<void> {
    try {
      // 检查存储配额
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usedMB = Math.round((estimate.usage || 0) / 1024 / 1024);
        const quotaMB = Math.round((estimate.quota || 0) / 1024 / 1024);
        const usedPercentage = (estimate.usage || 0) / (estimate.quota || 1);
        
        console.log(`存储使用情况: ${usedMB}MB / ${quotaMB}MB (${Math.round(usedPercentage * 100)}%)`);
        
        // 如果使用超过 90%，发出警告并清理
        if (usedPercentage > 0.9) {
          console.warn('存储空间即将耗尽，正在清理...');
          await indexedDBStorage.cleanup();
          
          // 清理后重新检查
          const newEstimate = await navigator.storage.estimate();
          const newUsedPercentage = (newEstimate.usage || 0) / (newEstimate.quota || 1);
          console.log(`清理后存储使用: ${Math.round(newUsedPercentage * 100)}%`);
        }
      }
      
      // 测试 IndexedDB 读写
      await this.testIndexedDBHealth();
      
    } catch (error) {
      console.error('存储健康检查出错:', error);
      // 如果出现严重错误，尝试恢复
      await this.attemptRecovery();
    }
  }
  
  /**
   * 测试 IndexedDB 健康状态
   */
  private static async testIndexedDBHealth(): Promise<void> {
    const testKey = '__health_check__';
    const testValue = JSON.stringify({ timestamp: Date.now() });
    
    try {
      // 尝试写入
      await indexedDBStorage.setItem(testKey, testValue);
      
      // 尝试读取
      const readValue = await indexedDBStorage.getItem(testKey);
      
      if (!readValue) {
        throw new Error('无法读取测试数据');
      }
      
      // 清理测试数据
      await indexedDBStorage.removeItem(testKey);
      
    } catch (error) {
      console.error('IndexedDB 健康检查失败:', error);
      throw error;
    }
  }
  
  /**
   * 尝试恢复存储
   */
  private static async attemptRecovery(): Promise<void> {
    try {
      console.warn('尝试恢复存储状态...');
      
      // 先尝试清理
      await indexedDBStorage.cleanup();
      
      // 如果清理不够，进行更激进的清理
      const estimate = await navigator.storage?.estimate();
      const usedPercentage = (estimate?.usage || 0) / (estimate?.quota || 1);
      
      if (usedPercentage > 0.95) {
        console.warn('存储空间严重不足，执行完全清理...');
        await indexedDBStorage.clearAll();
        
        // 提示用户需要刷新页面
        if (window.confirm('存储空间已清理，需要刷新页面以继续使用。是否立即刷新？')) {
          window.location.reload();
        }
      }
      
    } catch (error) {
      console.error('存储恢复失败:', error);
      
      // 最后手段：提示用户手动清理
      if (window.confirm('应用存储出现问题，建议清除浏览器数据后重新使用。是否打开设置页面？')) {
        // 在新窗口打开浏览器设置
        window.open('chrome://settings/clearBrowserData', '_blank');
      }
    }
  }
  
  /**
   * 获取存储使用情况
   */
  static async getStorageInfo(): Promise<{
    used: number;
    quota: number;
    percentage: number;
  }> {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const percentage = quota > 0 ? used / quota : 0;
        
        return { used, quota, percentage };
      }
    } catch (error) {
      console.error('获取存储信息失败:', error);
    }
    
    return { used: 0, quota: 0, percentage: 0 };
  }
}
