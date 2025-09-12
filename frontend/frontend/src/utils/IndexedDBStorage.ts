import { get, set, del, keys, clear } from 'idb-keyval'

export const indexedDBStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const data = await get(name)
      if (data === undefined || data === null) return null
      
      // 如果数据已经是对象格式，转换为JSON字符串返回
      if (typeof data === 'object') {
        return JSON.stringify(data)
      }
      
      return data
    } catch (error) {
      console.error('IndexedDB getItem error:', error)
      return null
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      // 检查存储配额
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate()
        const usedPercentage = (estimate.usage || 0) / (estimate.quota || 1)
        
        // 如果使用超过 80%，清理旧数据
        if (usedPercentage > 0.8) {
          console.warn('Storage quota nearly full, cleaning up...')
          await indexedDBStorage.cleanup()
        }
      }
      
      // 尝试解析JSON字符串为对象，这样在IndexedDB中以对象形式存储
      const parsedValue = JSON.parse(value)
      await set(name, parsedValue)
    } catch (error) {
      console.error('IndexedDB setItem error:', error)
      // 如果解析失败或存储失败，尝试清理后重试
      try {
        await indexedDBStorage.cleanup()
        const parsedValue = JSON.parse(value)
        await set(name, parsedValue)
      } catch (retryError) {
        console.error('IndexedDB setItem retry failed:', retryError)
        // 最后手段：存储原始字符串
        await set(name, value)
      }
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await del(name)
    } catch (error) {
      console.error('IndexedDB removeItem error:', error)
    }
  },
  
  // 新增：清理机制
  cleanup: async (): Promise<void> => {
    try {
      const allKeys = await keys()
      
      // 保留重要的键，删除其他数据
      const importantKeys = ['auth-store']
      const keysToDelete = allKeys.filter(key => 
        typeof key === 'string' && !importantKeys.some(important => key.includes(important))
      )
      
      // 删除不重要的缓存数据
      for (const key of keysToDelete) {
        await del(key)
      }
      
      console.log(`Cleaned up ${keysToDelete.length} IndexedDB entries`)
    } catch (error) {
      console.error('IndexedDB cleanup error:', error)
    }
  },
  
  // 新增：完全清空（紧急情况下使用）
  clearAll: async (): Promise<void> => {
    try {
      await clear()
      console.log('IndexedDB completely cleared')
    } catch (error) {
      console.error('IndexedDB clear error:', error)
    }
  }
}
