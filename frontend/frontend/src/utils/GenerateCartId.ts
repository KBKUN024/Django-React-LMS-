import GetUserData from './GetUserData'

/**
 * 会根据用户是否登录去获取不同的cart_id
 * 
 * 若已登录，每次相同用户得到的cart_id总是相同的，避免了购物车状态的丢失
 * 
 * 若未登录，调用generateCartId()去获取一个随机的10位cart_id
 */
function GenerateCartId(length: number = 10) {
    const generateCartId = () => {
        let cart_id = ''
        for (let i = 0; i < length; i++) {
            cart_id += String(Math.floor(Math.random() * 10))
        }
        return cart_id
    }

    // 使用简单的hash算法，得到基于用户ID生成固定的纯数字cart_id，相同的userId每次得到的cart_id总是相同的
    const generateUserBasedCartId = (userId: string) => {
        // 使用用户ID作为种子生成固定的10位数字cart_id,🧐这个hash算法看不懂
        let hash = 0
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i) // 获取userId在i位置的ASCII码值，如userId为1的话，ASCII码值为49
            hash = ((hash << 5) - hash) + char // hash << 5 相当于乘32，- hash相当于乘31，由于userId为1，ASCII码为49，那么hash = (0 * 32) * 31 + 49 = 49，所以最终为0000000049
            hash = hash & hash // 转换为32位整数
        }
        
        // 确保是正数并生成10位数字
        const positiveHash = Math.abs(hash)
        let cartId = String(positiveHash).padStart(10, '0') // 不足10位会在前面补0
        
        // 如果超过10位，截取前10位
        if (cartId.length > 10) {
            cartId = cartId.substring(0, 10)
        }
        
        return cartId
    }

    // 获取用户数据
    const userData = GetUserData() // 从refresh_token中解码出用户的信息，比如user_id那些
    
    if (userData?.user_id) {
        // 已登录用户：基于用户ID生成固定的纯数字cart_id，每次得到的 userBasedCartId 都是相同的
        const userBasedCartId = generateUserBasedCartId(userData.user_id)
        
        // 将用户绑定的cart_id存储到localStorage
        const existingUserCartId = localStorage.getItem(`cart_id_user_${userData.user_id}`)
        if (!existingUserCartId) {
            localStorage.setItem(`cart_id_user_${userData.user_id}`, userBasedCartId)
            localStorage.setItem('cart_id', userBasedCartId) // 保持兼容性
            return userBasedCartId
        }
        
        // 同步到通用cart_id
        localStorage.setItem('cart_id', existingUserCartId)
        return existingUserCartId
    } else {
        // 未登录用户：使用传统的随机cart_id
        const existingCartId = localStorage.getItem('cart_id')
        if (!existingCartId) {
            const newCartId = generateCartId()
            localStorage.setItem('cart_id', newCartId)
            return newCartId
        }
        return existingCartId
    }
}
export default GenerateCartId