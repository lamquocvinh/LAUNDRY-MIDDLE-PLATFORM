import React, { useEffect, useState } from "react";
import { Input, Table, Form, Radio, Button, Popconfirm, message, Divider, InputNumber } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
// import { useDispatch, useSelector } from "react-redux";
// import { BiEdit } from "react-icons/bi";
// import { AiFillDelete } from "react-icons/ai";
// import { Link, useLocation } from "react-router-dom";
// import { } from "../features/auth/authSlice";




const columns = [

  {
    title: "Service name",
    dataIndex: "name",
  },
  {
    title: "Unit",
    dataIndex: "quantity",
  },
  {
    title: "Price",
    dataIndex: "price",
  },
  {
    title: "Service type",
    dataIndex: "isStandard",
  },
  {
    title: "Total",
    dataIndex: "total",
  },

];


const ViewOrder = () => {

  const { userInfoDTO } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [order, setOrder] = useState();
  const [error, setError] = useState("");

  const [isLoading, setLoading] = useState(true);
  const [standard, setStandard] = useState();

  const confirm = (e) => {
    console.log(e);

  };

  const { id } = useParams()



  const onFinish = (e) => {
    const item = order.items[checkStandardd(data1)];
    console.log("sssss" + item)
    if (checkStandardd(data1) < 0) {
      updateOrder(5)
    } else {
      updateWeight(item.id, e.weight);
      updateOrder(5)


    }
    navigate(`/store/order/${id}`)


  };

  const getOrder = async (id) => {
    try {
      setError("");
      const res = await axios.get(`https://magpie-aware-lark.ngrok-free.app/api/v1/store/order/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          'ngrok-skip-browser-warning': 'true'

        },
      })

      if (res.status === 200) {
        setOrder(res.data);

        setLoading(false)
      } else {
        setLoading(true)

      }
    } catch (error) {
      setLoading(false)
      setError(error.toJSON().message)
    }


  }

  const getPrices = async (id) => {
    try {
      const res = await axios.get(`https://magpie-aware-lark.ngrok-free.app/api/v1/store/standard-service/prices?store=${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          'ngrok-skip-browser-warning': 'true'

        },
      })

      setStandard(res.data);
    } catch (error) {
      setError(error.message)
    }


  }




  const updateOrder = async (values) => {

    const res = await axios.put(`https://magpie-aware-lark.ngrok-free.app/api/v1/store/order/update/${id}?status=${values}`,null,{
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        'ngrok-skip-browser-warning': 'true'

      }
    },)
    if (res.status === 200) {
      setOrder(res.data)
      setLoading(false)
    } else {
      setLoading(true)
    }
  }

  const updateWeight = async (id,values) => {

    const res = await axios.put(`https://magpie-aware-lark.ngrok-free.app/api/v1/store/order/item/update/${id}?weight=${values}`,null,{
     
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        'ngrok-skip-browser-warning': 'true'

      },
    })



  }





  // function generateCurrency(params) {
  //   return params.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  // }

  function generateCurrency(params) {
    return params.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2, // Đảm bảo hiển thị ít nhất 2 chữ số thập phân
    });
  }


  function checkStandardd(params) {
    return params.findIndex(item => item.isStandard === "Dry cleaning");
  }

  const data1 = [];
  for (let i = 0; i < order?.items?.length; i++) {
    data1.push({
      key: i + 1,
      name: order.items[i].laundryService.name,
      quantity: order.items[i].quantity,
      price: order.items[i].laundryService.isStandard ? "" : generateCurrency(order.items[i].laundryService.details[0].price),
      total: generateCurrency(order.items[i].total),
      


      isStandard: order.items[i].laundryService.isStandard ? ("Dry cleaning") : ("Laundry Drying")

    });
  }




  const data2 = useState([]);
  for (let i = 0; i < standard?.length; i++) {
    data2.push({
      from: standard[i].from,
      to: standard[i].to
    })


  }
  const min = data2.reduce(function (prev, current) {
    return (prev && prev.from < current.from) ? prev : current
  })

  const max = data2.reduce(function (prev, current) {
    return (prev && prev.to > current.to) ? prev : current
  })

  console.log(min.from + "&" + max.to)
  useEffect(() => {

    getOrder(id);
    getPrices(userInfoDTO.id)



  }, [])

  function renderComponent(params) {
    return (
      <div>
        {(() => {
          switch (params) {
            case 1:
              return <Form
                style={{ textAlign: "center" }}
                layout="vertical"

              >

                <Form.Item name="confirm" style={{ paddingTop: "20px" }}>


                  <Button success onClick={() => updateOrder(2)} style={{ marginRight: '40px' }} size="large" type="primary">Confirm</Button>

                  <Popconfirm
                    title="Hủy đơn hàng"
                    description="Bạn thật sự muốn từ chối đơn hàng này ?"
                    onConfirm={() => updateOrder(0)} 

                    okText="Xác nhận"
                    cancelText="Hủy"
                  >
                    <Button danger size="large" type="primary">Refuse</Button>
                  </Popconfirm>


                </Form.Item>





              </Form>
            case 2:
              return <h2 style={{ color: "blue", textAlign: "center" }}>Đang chờ lấy hàng...</h2>
            case 3:
              return <h2 style={{ color: "blue", textAlign: "center" }}>Đơn đang vận chuyển đến cửa hàng</h2>

            case 4:
              return <Form

                form={form}
                onFinish={onFinish}

                // layout="horizontal"
                initialValues={{ status: 3 }

                }>
                {checkStandardd(data1) > -1 ? (<Form.Item name='weight' label="Nhập cân nặng cho dịch vụ giặt sấy" style={{ padding: "10px" }} rules={[{ required: true, message: `Vui lòng nhập dữ liệu !` }]}>
                  <InputNumber min={min.from} max={max.to}>
                  </InputNumber>

                </Form.Item>) : <div></div>}


                <Form.Item name="status" style={{ padding: "20px" }}>

                  <Button success size="large" type="primary" htmlType="submit" style={{ minWidth: "18rem" }}>Xác nhận hoàn thành</Button>
                </Form.Item>
              </Form>
            case 5:
              return <h2 style={{ color: "blue", textAlign: "center" }}>Đơn sẵn sàng vận chuyển</h2>
            case 6:
              return <h2 style={{ color: "cyan", textAlign: "center" }}>Đơn đang vận chuyển</h2>
            case 7:
              return <h2 style={{ color: "#33ff33", textAlign: "center" }}>Đơn đã hoàn thành</h2>

            case 0:
              return <h2 style={{ color: "red", textAlign: "center" }}>Đơn đã hủy</h2>
            default:
              return null
          }
        })()}
      </div>
    )
  }


  console.log(error.length)

  return (



    <>
      {error.length < 1 ? (isLoading ? <LoadingSpinner /> : <div class="container-fluid py-2">
        <div class="row">
          <div class="col-lg-8">

            <div class="card mb-4">
              <div class="card-body">
                <div class="row">
                  <label className="d-flex start display-7 pb-2">Order details</label>

                  <h6 className="d-flex float-start">Booking date:   {order ? (order?.orderDate) : ""}</h6>
                  {order ? <Table dataSource={data1} columns={columns} pagination={false}></Table> : ""}

                </div>
                <div class="row p-3 float-end">

                  <div class="card">
                    <h4 className="d-flex float-start py-2">Order price : </h4>

                    <Divider></Divider>
                    <div className="card-data row" >
                      <div className="col-10 fw-bold" style={{ textAlign: "left" }}>

                        <h5>total cost:</h5>

                      </div>
                      <div className="col-2" style={{ textAlign: "left" }}>

                      </div>
                      <h4 style={{ textAlign: "right", color: "green" }}>{order.total ? generateCurrency(order?.total) : ""}</h4>

                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>

          <div class="col-lg-4">
            <div class="card mb-4">
              <h3 class="fw-bolder py-2" style={{ color: "green", textAlign: "center" }}>Confirm application status</h3>

              <div className="card m-3">

                {renderComponent(order?.status)}
              </div>
              <div>{order?.payments.method}</div>
            </div>

            <div className="card mb-4 p-3">

              <h5 class="fw-bolder">Customer information</h5>

              <div className="card my-2">

                <div className="row p-5" >
                  <div className="col-4 fw-bold" style={{ textAlign: "left" }}>
                    <p >Full name: </p>
                    <p >Email: </p>
                    <p >Address: </p>
                    <p >Phone: </p>

                  </div>
                  <div className="col-8" style={{ textAlign: "left" }}>
                    <p>{order?.user?.fullName}</p>
                    <p>{order?.user?.email}</p>
                    <p>{order?.user?.address}</p>
                    <p>{order?.user?.phone}</p>
                  </div>

                </div>


              </div>





            </div>

          </div>

        </div>
      </div>
      ) : <><h2 style={{ color: "red" }}>{error}</h2></>}



    </>

  );
};

export default ViewOrder;