import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'


import Sidebar from './Partials/Sidebar'
import Header from './Partials/Header'
import { useQuery } from '@tanstack/react-query'
import type { Wishlist as WishlistType } from '@/types/base'
import { createAuthenticatedAxios } from '@/api/axios'
import { useAuthStore } from '@/store'
import CourseListItem from '@/components/base/Index/CourseListItem'
import { GetUserData } from '@/utils'
import { FaHeart } from "react-icons/fa";
function Wishlist() {
    const authAxios = createAuthenticatedAxios()
    const { profile } = useAuthStore()
    const [wishlist, setWishlist] = useState<WishlistType[]>([])
    const userData = GetUserData()
    console.log('userdata:', userData)

    const fetchWishlist = async (): Promise<WishlistType[]> => {
        const res = await authAxios
            .get(`student/wish_list/${userData?.user_id}/`)
        return res.data
    };

    const { data: wish_list_res } = useQuery({
        queryKey: ['wish-list'],
        queryFn: fetchWishlist,
        staleTime: 5 * 60 * 1000,
        enabled: !!GetUserData()?.user_id
    })

    useEffect(() => {
        if (wish_list_res) {
            setWishlist(wish_list_res)
        }
    }, [wish_list_res])
    console.log('wishlist:', wishlist)

    return (
        <section className="pt-5 pb-5">
            <Container>
                {/* Header Here */}
                <Header profile={profile} />
                <Row className="mt-0 mt-md-4">
                    {/* Sidebar Here */}
                    <Sidebar />
                    <Col lg={9} md={8} xs={12}>
                        <h4 className="mb-0 mb-4">
                            <FaHeart className="me-2" /> Wishlist
                        </h4>
                        <Row>
                            {
                                wishlist && wishlist.length ?
                                    (
                                        wishlist.map((wl, index) => (
                                            <Col key={index} lg={4} md={6} xs={12} className="mb-4">
                                                <CourseListItem course={wl.course} />
                                            </Col>
                                        ))
                                    )
                                    :
                                    <Col xs={12} style={{ height: 500 }}>
                                        <h3>
                                            No Wish list.
                                        </h3>
                                    </Col>
                            }
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Wishlist