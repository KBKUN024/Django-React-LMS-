import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createAuthenticatedAxios } from '@/api/axios'

function Success() {
    const [payMessage, setPayMessage] = useState('')
    const authAxios = createAuthenticatedAxios()
    const params = useParams()
    console.log('params:', params)
    const url = new URLSearchParams(window.location.search)
    const session_id = url.get('session_id')
    const paypal_order_id = url.get('paypal_order_id')
    console.log(url.get('session_id'))
    console.log(url.get('paypal_order_id'))
    const mutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData()
            formData.append('cart_order_id', String(params.cart_order_id))
            formData.append('session_id', String(session_id))
            formData.append('paypal_order_id', String(paypal_order_id))
            setPayMessage("Processing Payment");
            const res = await authAxios.post('/payment/payment-success/', formData)
            return res.data
        }, onSuccess: (data) => {
            setPayMessage(data.message)
            console.log('支付结果:', data)
        }, onError: (error) => {
            console.log('支付失败', error)
        }
    })
    useEffect(() => {
        mutation.mutate()
    }, [])
    return (
        <>
            <section className="pt-0  position-relative overflow-hidden my-auto">
                <div className="container position-relative">
                    <div className="row g-5 align-items-center justify-content-center">
                        {/* 支付成功 */}
                        {
                            (payMessage == 'Already Paid.' || payMessage == 'Payment Successful') &&
                            <>
                                <div className="col-lg-5">
                                    <h1 className="text-success">Enrollment Successful!</h1>
                                    <p> Hey there, you enrollment in the 2 courses where successful, visit your <a href="">My Courses</a> page, to view the courses now.</p>
                                    <button type="button" className="btn btn-primary mb-0 rounded-2">View Enrolled Courses <i className='fas fa-arrow-right'></i></button>
                                </div>
                                <div className="col-lg-7 text-center">
                                    <img src="https://cdn.dribbble.com/userupload/23589345/file/original-3facc6dbca53f39fa3175635da27a61a.gif" className="h-300px h-sm-400px h-md-500px h-xl-700px" alt="" />
                                </div>
                            </>
                        }

                        {/* 处理中 */}
                        {
                            payMessage == 'Processing Payment' &&
                            <>
                                <div className="col-lg-5">
                                    <h1 className="text-warning">Processing Payment <i className='fas fa-spinner fa-spin'></i></h1>
                                    <p> Hey there, hold on while we process your payment, please do not leave the page.</p>
                                </div>
                                <div className="col-lg-7 text-center">
                                    <img src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1259.gif" className="h-300px h-sm-400px h-md-500px h-xl-700px" alt="" />
                                </div>
                            </>
                        }


                        {/* 支付失败 */}
                        {
                            payMessage == 'Payment Failed' &&
                            <>
                                <div className="col-lg-5">
                                    <h1 className="text-danger">Payment Failed 😔</h1>
                                    <p>Unfortunately, phew! Your payment did not go through. <br /> Please try again.</p>
                                    <button type="button" className="btn btn-danger mb-0 rounded-2">Try again <i className='fas fa-repeat'></i></button>

                                </div>
                                <div className="col-lg-7 text-center">
                                    <img src="https://media3.giphy.com/media/h4OGa0npayrJX2NRPT/giphy.gif?cid=790b76117pc6298jypyph0liy6xlp3lzb7b2y405ixesujeu&ep=v1_stickers_search&rid=giphy.gif&ct=e" className="h-300px h-sm-400px h-md-500px h-xl-700px" alt="" />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default Success