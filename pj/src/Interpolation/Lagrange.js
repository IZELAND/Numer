import React, { Component } from 'react'
import {Card, Input, Button, Table} from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';

var api;
const InputStyle = {
    background: "#1890ff",
    color: "white", 
    fontWeight: "bold", 
    fontSize: "24px"

};
var columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    }
];
var x, y, tableTag,  interpolatePoint, tempTag, fx

class Lagrange extends Component {
    
    constructor() {
        super();
        x = []
        y = []
        interpolatePoint = []
        tempTag = []
        tableTag = []
        this.state = {
            nPoints: 0,
            X: 0,
            interpolatePoint: 0,
            showInputForm : true,
            showTableInput: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.lagrange = this.lagrange.bind(this);
    
    }  
    createTableInput(n) {
        for (var i=1 ; i<=n ; i++) {
            x.push(<Input style={{
                width: "100%",
                height: "50%", 
                backgroundColor:"black", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }}
            id={"x"+i} key={"x"+i} placeholder={"x"+i}/>);
            y.push(<Input style={{
                width: "100%",
                height: "50%", 
                backgroundColor:"black", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"y"+i} key={"y"+i} placeholder={"y"+i}/>);   
            tableTag.push({
                no: i,
                x: x[i-1],
                y: y[i-1]
            });
        }


        this.setState({
            showInputForm: false,
            showTableInput: true,
        })
    }
    createInterpolatePointInput(){
        for (var i=1 ; i<=this.state.interpolatePoint ; i++) {
            tempTag.push(<Input style={{
                width: "14%",
                height: "50%", 
                backgroundColor:"black", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"p"+i} key={"p"+i} placeholder={"p"+i} />)
        }
    }
    initialValue() {
        x = []
        y = []
        for (var i=1 ; i<=this.state.nPoints ; i++) {
            x[i] = parseFloat(document.getElementById("x"+i).value);
            y[i] = parseFloat(document.getElementById("y"+i).value);
        }
        for (i=1 ; i<=this.state.interpolatePoint ; i++) {
            interpolatePoint[i] = parseFloat(document.getElementById("p"+i).value);
        }
    }

    L(X, index, n) {
        var numerate = 1/*ตัวเศษ*/, denominate = 1/*ตัวส่วน*/;
        for (var i=1 ; i<=n ; i++) {
            if (i !== index) {
                numerate *= x[i]-X;
                denominate *= x[i] - x[index];
            }
        } 
        console.log(numerate/denominate)
        return parseFloat(numerate/denominate);
    }

    lagrange(n, X) {
        fx = 0
        this.initialValue()
        for (var i=1 ; i<=n ; i++) {
            fx += this.L(X, i, n)*y[i];
        }
        this.setState({
            showOutputCard: true
        })

    } 

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async dataapi() {
        await axios({
          method: "get",
          url: "http://localhost:5000/database/lagrange",
        }).then((response) => {
          console.log("response: ", response.data);
          api = response.data;
        });
        await this.setState({
            nPoints: api.nPoints,
            X: api.X,
            interpolatePoint: api.interpolateinput,
        });
        x = []
        y = []
        interpolatePoint = []
        tempTag = []
        tableTag = []
        await this.createInterpolatePointInput();
        await this.createTableInput(api.nPoints);
        for (let i = 1; i <= api.nPoints; i++) {
          document.getElementById("x" + i ).value = api.arrayX[i - 1];
          document.getElementById("y" + i).value = api.arrayY[i - 1];
        }
        for (let i = 1; i <= api.interpolateinput; i++) {
          document.getElementById("p" + i ).value = api.interpolatePoint[i - 1];
        }
        this.lagrange(parseInt(this.state.interpolatePoint), parseFloat(this.state.X));
      }

    render() {
        return(
            <div style={{ background: "#FFFF",padding: "30px" }}>

                <h1 style = {{textAlign: 'center',fontSize:'30px'}}>Lagrange Interpolation</h1>

                <div className="row">
                    <form style = {{textAlign: 'center',fontSize:'21px'}}>

                            {this.state.showInputForm && 
                                <div>
                                    <h5>Number of points(n): <Input size="large" name="nPoints" style={{ width: 500 }}></Input></h5>
                                    <h5>X: <Input size="large" name="X" style={{ width: 500 }}></Input></h5>
                                    <h5>interpolatePoint: <Input size="large" name="interpolatePoint" style={{ width: 500 }}></Input></h5>

                                    <Button id="dimention_button" size={'large'}
                                        onClick= {()=>{this.createTableInput(parseInt(this.state.nPoints));this.createInterpolatePointInput()}}
                                        style={{ background:'#0F60F8', color: "white" }}>Submit
                                    </Button>

                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button type="submit"   size="large"
                                        onClick={() => this.dataapi()}
                                        style={{ background:'#14BE08', color: "white" }}>Function
                                    </Button>
                                </div> 
                            }
                            {this.state.showTableInput && 
                                <div>
                                    <Table columns={columns} dataSource={tableTag} pagination={false} bordered={true} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "white" , overflowY: "scroll", minWidth: 120, maxHeight: 300}}></Table>
                                    <br/><h2>interpolatePoint {parseInt(this.state.interpolatePoint) === 2 ? "(Linear)": 
                                                            parseInt(this.state.interpolatePoint) === 3 ? "(Quadratic)" :
                                                            "(Polynomial)"}</h2>{tempTag}
                                    <Button 
                                        id="matrix_button"  
                                        style={{background: "blue", color: "white", fontSize: "20px"}}
                                        onClick={()=>this.lagrange(parseInt(this.state.interpolatePoint), parseFloat(this.state.X))}>
                                        Submit
                                    </Button>
                                    
                                </div>
                            }
                    </form>

                    <div className="col">
                        {this.state.showOutputCard &&
                            <Card
                            title={"Output"}
                            bordered={true}
                            style={{ border: "2px solid black", background: "rgb(61, 104, 61) none repeat scroll 0% 0%", color: "white" }}
                            >
                                <p style={{fontSize: "24px", fontWeight: "bold"}}>{fx}</p>
                            </Card>                        
                        }                        
                    </div>     
                </div>

                
            </div>
        );
    }
}
export default Lagrange;