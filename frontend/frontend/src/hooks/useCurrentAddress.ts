import { useState, useEffect } from 'react'

interface Address{
    country:string
}

function useCurrentAddress() {
    const [address, setAddress] = useState<Address>()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true // 检查组件是否挂载
        // 检查浏览器是否支持地理位置API
        if (!navigator.geolocation) {
            setError('浏览器不支持地理位置功能')
            return
        }

        setError(null)

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                if (!isMounted) return // 组件已经卸载，下面的都不执行，直接返回
                try {
                    const { latitude, longitude } = pos.coords
                    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`

                    const response = await fetch(url)
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }

                    const data = await response.json()
                    // console.log('解析后的地理位置数据:', data)
                    setAddress(data.address)
                } catch (err) {
                    // console.error('获取地址信息失败:', err)
                    setError('获取地址信息失败')
                }
            },
            (err) => {
                if (!isMounted) return // 组件已经卸载，下面的都不执行，直接返回
                // console.error('获取地理位置失败:', err)
                let errorMessage = '获取地理位置失败'

                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = '用户拒绝了地理位置权限请求'
                        break
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = '地理位置信息不可用'
                        break
                    case err.TIMEOUT:
                        errorMessage = '获取地理位置超时'
                        break
                    default:
                        errorMessage = '获取地理位置时发生未知错误'
                        break
                }

                setError(errorMessage)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5分钟缓存
            }
        )
        return () => {
            isMounted = false
        }
    }, [])

    return { address, error }
}
export default useCurrentAddress