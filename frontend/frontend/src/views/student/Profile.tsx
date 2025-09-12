import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { Sidebar as StudentSidebar } from '../student'
import { Sidebar as TeacherSidebar, Header } from '@/views/instructor'
import { useAuthStore } from '@/store'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { GetUserData } from '@/utils'
import { createAuthenticatedAxios } from '@/api/axios'
import Toast from '@/utils/SweetAlert2/Toast'
interface ProfileDataType {
  full_name: string,
  about: string,
  country: string,
}

function Profile() {
  const { profile, allUserData } = useAuthStore()
  const authAxios = createAuthenticatedAxios()
  const queryClient = useQueryClient()
  const userData = GetUserData()
  const isTeacher = Number(!!allUserData?.teacher_id) !== 0
  const [profileData, setProfileData] = useState<ProfileDataType>({
    full_name: '',
    about: '',
    country: '',
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        about: profile.about || '',
        country: profile.country || ''
      })
      setImagePreview(profile.image || '')
    }
  }, [profile])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 存储原始文件对象
      setSelectedFile(file)

      // 创建文件预览URL
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(String(event.target.result))
        }
      }
      reader.readAsDataURL(file)
    }
  }
  const profileMutation = useMutation({
    mutationFn: async () => {
      const formdata = new FormData();

      // 只有在用户选择了新文件时才添加图片
      if (selectedFile) {
        formdata.append("image", selectedFile);
      }

      formdata.append("full_name", profileData.full_name);
      formdata.append("about", profileData.about);
      formdata.append("country", profileData.country);

      const res = await authAxios
        .patch(`user/profile/${userData?.user_id}/`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userData?.user_id] })
      Toast.fire({
        icon: 'success',
        text: 'profile更新成功🏅'
      })
      console.log('profile更新成功的返回值 -> data:', data)
    },
    onError: (error) => {
      Toast.fire({
        icon: 'error',
        text: 'profile更新失败☹️' + error
      })
    }
  })
  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    profileMutation.mutate()
  };



  return (
    <section className="pt-5 pb-5">
      <Container>
        {
          isTeacher && <Header />
        }
        <Row className="mt-0 mt-md-4">
          {/* Sidebar Here */}
          {
            isTeacher ? <TeacherSidebar /> : <StudentSidebar />
          }
          <Col lg={9} md={8} xs={12}>
            {/* Card */}
            <Card>
              {/* Card header */}
              <Card.Header>
                <h3 className="mb-0">Profile Details</h3>
                <p className="mb-0">
                  You have full control to manage your own account setting.
                </p>
              </Card.Header>
              {/* Card body */}
              <Card.Body>
                <Form onSubmit={updateProfile}>
                  <div className="d-lg-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center mb-4 mb-lg-0">
                      <img
                        src={String(imagePreview) || undefined}
                        id="img-uploaded"
                        className="avatar-xl rounded-circle"
                        alt="avatar"
                        style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div className="ms-3">
                        <h4 className="mb-0">Your avatar</h4>
                        <p className="mb-0">
                          PNG or JPG no bigger than 800px wide and tall.
                        </p>
                        <Form.Control onChange={handleFileChange} type="file" className="mt-3" />
                      </div>
                    </div>
                  </div>
                  <hr className="my-5" />
                  <div>
                    <h4 className="mb-0">Personal Details</h4>
                    <p className="mb-4">Edit your personal information and address.</p>
                    {/* Form */}
                    <Row className="gx-3">
                      {/* Full name */}
                      <Col xs={12} md={12} className="mb-3">
                        <Form.Label htmlFor="fname">
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="fname"
                          placeholder="First Name"
                          required
                          name='full_name'
                          defaultValue={profile?.full_name}
                          onChange={handleProfileChange}
                        />
                      </Col>
                      {/* About Me */}
                      <Col xs={12} md={12} className="mb-3">
                        <Form.Label htmlFor="lname">
                          About Me
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name='about'
                          defaultValue={String(profile?.about)}
                          onChange={handleProfileChange}
                        />
                      </Col>

                      {/* Country */}
                      <Col xs={12} md={12} className="mb-3">
                        <Form.Label htmlFor="editCountry">
                          Country
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="country"
                          placeholder="Country"
                          required
                          name='country'
                          defaultValue={profile?.country ? profile.country : ''}
                          onChange={handleProfileChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please choose country.
                        </Form.Control.Feedback>
                      </Col>
                      <Col xs={12}>
                        {/* Button */}
                        <Button variant="primary" type="submit">
                          Update Profile <i className='fas fa-check-circle'></i>
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Profile