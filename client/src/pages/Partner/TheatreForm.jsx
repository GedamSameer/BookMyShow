import {Form, Modal, Col,Row,Input,Select,Button,message} from "antd"
import { useDispatch, useSelector } from "react-redux"
import moment from "moment"
import TextArea from "antd/es/input/TextArea"
import { HideLoading, ShowLoading } from "../../redux/loaderSlice"
import { addTheatre, updateTheatre } from "../../apicalls/theatres"

const TheatreForm = ({setIsModalOpen,selectedTheatre,setSelectedTheatre,formType,getData}) => {
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.user)
    
    const handleCancel = () => {
        setIsModalOpen(false)
        setSelectedTheatre(null)
    }
    const onFinish = async (values) => {
        console.log(values)
        try{
            dispatch(ShowLoading())
            let response = null
            if(formType === "add"){
                response = await addTheatre({...values,owner:user._id})
            }else{
                response = await updateTheatre(selectedTheatre._id,values)
            }
            if(response.success){
                getData()
                message.success(response.message)
                setIsModalOpen(false)
            }else{
                message.error(response.message)
            }
            setSelectedTheatre(null)
            dispatch(HideLoading())
        }catch (err){
            dispatch(HideLoading())
            message.error(err.message)
        }
    }
    return (
        <Modal centered open={true} width={600} footer={null} title={formType === "add" ? "Add theatre" : "Edit theatre"} onCancel={handleCancel} >
        <Form layout="vertical" style={{width:"100%"}} initialValues={selectedTheatre} onFinish={onFinish} >
            <Row gutter={{xs:6,sm:10,md:12,lg:16}}>
                <Col span={24}>
                    <Form.Item label="Theatre Name" htmlFor="name" name="name" rules={[{required:true,message:"Theatre name is required!"}]}>
                        <Input id="name" type="text" placeholder="Enter the theatre name" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Theatre Address" htmlFor="address" name="address" rules={[{required:true,message:"Theatre address is required!"}]}>
                        <TextArea id="address" rows="3" placeholder="Enter the theatre address" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Row gutter={{xs:6,sm:10,md:12,lg:16}}>
                        <Col span={12}>
                            <Form.Item label="Email" htmlFor="email" name="email" rules={[{required:true,message:"Email is required!"}]}>
                                <Input id="email" type="email" placeholder="Enter the theatre email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Phone Number" htmlFor="phone" name="phone" rules={[{required:true,message:"Phone Number is required!"}]}>
                                <Input id="phone" type="number" placeholder="Enter the theatre Phone Number" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Form.Item style={{display:"flex",justifyContent:"center"}}>
                <Button type="primary" htmlType="submit" style={{fontSize:"1rem",fontWeight:"600"}} >Submit the data</Button>
                <Button className="mt-3" style={{marginLeft:"5px"}} onClick={handleCancel}>Cancel</Button>
            </Form.Item>
        </Form>
        </Modal>
    )
}
export default TheatreForm