import { useState } from "react";
import { Modal, Button, Container, Row, Col, Card, ListGroup, Form } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAuthenticatedAxios } from '@/api/axios'
import { getCurrentTeacherId } from '@/api/constants'
import type { Coupon as CouponType } from '@/types/base'
import dayjs from 'dayjs'
import Toast from '@/utils/SweetAlert2/Toast'
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import { FaTrash } from "react-icons/fa";

function Coupon() {
  const authAxios = createAuthenticatedAxios()
  const teacherId = getCurrentTeacherId()
  const queryClient = useQueryClient()
  const [coupon, setCoupon] = useState({ code: '', discount: '' })
  const [selectedCoupon, setSelectedCoupon] = useState<CouponType>()
  const [show, setShow] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (coupon: CouponType) => {
    setShow(true)
    setSelectedCoupon(coupon)
  };

  const handleAddCouponClose = () => setShowAddCoupon(false);
  const handleAddCouponShow = () => setShowAddCoupon(true);

  const fetchCoupons = async (): Promise<CouponType[]> => {
    const res = await authAxios.get(`teacher/coupon-list/${teacherId}/`)
    return res.data
  };
  const addNewCoupon = async () => {
    const res = await authAxios.post(`teacher/coupon-list/${teacherId}/`, {
      code: coupon.code,
      discount: coupon.discount,
      active: true,
      teacher: teacherId
    })
    return res.data
  }
  const updateCoupon = async (coupon_id?: string) => {
    const res = await authAxios.patch(`teacher/coupon-detail/${teacherId}/${coupon_id}/`, {
      code: selectedCoupon?.code,
      discount: selectedCoupon?.discount
    })
    return res.data
  }
  const deleteACoupon = async (coupon_id?: string) => {
    const res = await authAxios.delete(`teacher/coupon-detail/${teacherId}/${coupon_id}/`)
    return res.data
  }
  // 创建自定义hook来封装mutation逻辑
  const useCouponMutation = (
    fn: (coupon_id?: string) => Promise<any>,
    successText: string,
    errorText: string
  ) => {
    return useMutation({
      mutationFn: (variables: { coupon_id?: string }) => fn(variables?.coupon_id),
      onSuccess: (data) => {
        console.log(data)
        queryClient.invalidateQueries({ queryKey: ['coupon-list', teacherId] })
        Toast.fire({
          icon: 'success',
          text: successText
        })
        handleAddCouponClose()
        handleClose()
      },
      onError: (error) => {
        Toast.fire({
          icon: 'error',
          text: errorText + error
        })
      }
    })
  }

  // 定义各种mutation
  const updateMutation = useCouponMutation(updateCoupon, '更新优惠券成功🏅', '更新优惠券失败☹️')
  const addMutation = useCouponMutation(addNewCoupon, '添加优惠券成功🏅', '添加优惠券失败☹️')
  const deleteMutation = useCouponMutation(deleteACoupon, '删除优惠券成功🏅', '删除优惠券失败☹️')

  const update_a_coupon = (e: React.FormEvent, coupon_id: string) => {
    e.preventDefault()
    updateMutation.mutate({ coupon_id: coupon_id })
  }

  const create_a_coupon = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('haha')
    addMutation.mutate({})
  }

  const delete_a_coupon = (coupon_id: string) => {
    deleteMutation.mutate({ coupon_id: coupon_id })
  }
  const handleCoupon = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {

    const { name, value } = e.target
    console.log('name:', name)
    console.log('value:', value)
    if (type == 'add') {
      setCoupon({
        ...coupon,
        [name]: name == 'discount' ? value.replace('%', '') : value
      })
    } else {
      setSelectedCoupon(prev => prev ? {
        ...prev,
        [name]: name == 'discount' ? value.replace('%', '') : value
      } : undefined)
    }
  }
  console.log('coupon:', coupon)
  console.log('selectedCoupon:', selectedCoupon)

  const { data: coupon_list } = useQuery({
    queryKey: ['coupon-list', teacherId],
    queryFn: fetchCoupons,
    enabled: !!teacherId, // 只有 当teacherId存在时才执行查询
  })
  console.log('coupon_list:', coupon_list)

  return (
    <>
      <section className="pt-5 pb-5">
        <Container>
          {/* Header Here */}
          <Header />
          <Row className="mt-0 mt-md-4">
            {/* Sidebar Here */}
            <Sidebar />
            <Col lg={9} md={8} xs={12}>
              {/* Card */}
              <Card className="mb-4">
                {/* Card header */}
                <Card.Header className="d-lg-flex align-items-center justify-content-between">
                  <div className="mb-3 mb-lg-0">
                    <h3 className="mb-0">Coupons</h3>
                    <span>Manage all your coupons from here</span>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleAddCouponShow}
                  >
                    Add Coupon
                  </Button>
                </Card.Header>
                {/* Card body */}
                <Card.Body>
                  {/* List group */}
                  <ListGroup variant="flush">
                    {/* List group item */}
                    {
                      coupon_list?.map((coupon, index) => (
                        <ListGroup.Item key={index} className="d-flex p-4 mb-1 shadow rounded-3">
                          <div className="d-flex">
                            <div key={index} className="ms-3 mt-2">
                              <div className="d-flex align-items-center justify-content-between">
                                <div>
                                  <h4 className="mb-0">{coupon.code}</h4>
                                  <span>{coupon.used_by.length} Student</span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="mt-2">
                                  <span className="me-2 fw-bold">
                                    Discount:{" "}
                                    <span className="fw-light">{coupon.discount}% Discount</span>
                                  </span>
                                </p>
                                <p className="mt-1">
                                  <span className="me-2 fw-bold">
                                    Date Created:{" "}
                                    <span className="fw-light">{dayjs(coupon.date).format('DD/MM/YY')}</span>
                                  </span>
                                </p>
                                <p>
                                  <Button
                                    variant="outline-secondary"
                                    onClick={() => handleShow(coupon)}
                                  >
                                    Update Coupon
                                  </Button>

                                  <Button
                                    variant="danger"
                                    className="ms-2"
                                    onClick={() => delete_a_coupon(String(coupon.id))}
                                  >
                                    <FaTrash />
                                  </Button>
                                </p>
                              </div>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))
                    }
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Update Coupon - <span className="fw-bold">{selectedCoupon?.code}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => update_a_coupon(e, String(selectedCoupon?.id))}>
            <Form.Group className="mb-3">
              <Form.Label>
                Code
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Code"
                name="code"
                defaultValue={selectedCoupon?.code}
                onChange={(e) => handleCoupon(e, 'update')}
              />
              <Form.Label className="mt-3">
                Discount
              </Form.Label>
              <Form.Control
                type="text"
                name="discount"
                placeholder="Discount"
                defaultValue={`${selectedCoupon?.discount}%`}
                onChange={(e) => handleCoupon(e, 'update')}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Update Coupon <i className="fas fa-check-circle"> </i>
            </Button>

            <Button className="ms-2" variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showAddCoupon} onHide={handleAddCouponClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={create_a_coupon}>
            <Form.Group className="mb-3">
              <Form.Label>
                Code
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Code"
                name="code"
                onChange={(e) => handleCoupon(e, 'add')}
              />
              <Form.Label className="mt-3">
                Discount
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Discount: xx%"
                name="discount"
                onChange={(e) => handleCoupon(e, 'add')}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Create Coupon <i className="fas fa-plus"> </i>
            </Button>

            <Button
              className="ms-2"
              variant="secondary"
              onClick={handleAddCouponClose}
            >
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Coupon;
