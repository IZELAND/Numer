import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input ,Typography , Button,Table } from 'antd';
import {range, compile,evaluate,simplify,parse,abs,derivative} from 'mathjs'
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'
// import api from '../api'
//import Title from 'antd/lib/skeleton/Title';
var dataGraph = []
const PlotlyComponent = createPlotlyComponent(Plotly)
const { Title } = Typography;

const columns = [
  {
    title: 'Iteration',
    dataIndex: 'iteration',
    key : 'iteration'
  },
  {
    title: 'X0',
    dataIndex: 'x1',
    key : 'x1'
  },
  {
    title: 'X',
    dataIndex: 'x2',
    key: 'x2'
  },
  {
    title: 'Error',
    dataIndex: 'error',
    key : 'error'
  },
];
var dataTable = [];

class Onepoint extends Component
{
  constructor() {
    super();
    this.state = {
      size: 'large',
    fx : "",
    x1: 0,
    x2 : 0 ,
    x0 : 0,
    showTable:false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


//   componentDidMount = async() => { 
//     await api.getFunctionByName("Onepoint").then(db => {
//     this.setState({
//         fx:db.data.data.fx,
//         x1:db.data.data.x,
       
//     })
//     console.log(this.state.fx);
//     console.log(this.state.x0);
//     console.log(this.state.x1);
//     })
//   }
  Graph(x2)
  {
        dataGraph = [
        {
          type: 'scatter',  
          x: x2,        
          marker: {         
            color: '#3c753c'
          },
          name:'X1'
        },
        ];
      
    }

    func(x) {  
      let scope = {x : parseFloat(x)};
      var expr = compile(this.state.fx);
      return expr.evaluate(scope)
  }

  error(xm,x0){
    return Math.abs(xm-x0);
  }

  
  createTable(x2,x1,error){
    dataTable =[]
    var i = 0;
    for (i=1;i<error.length;i++){
      dataTable.push({
        iteration: i ,
        x2: x2[i],
        x1: x1[i],
        error: error[i],
    });
    }
    console.log(x1)
  }

  onInputChange = (event) =>{
    this.setState({
      [event.target.name]:event.target.value
    })
    console.log(this.state);
  }

  onSubmit (){
    var fx = this.state.fx;
    var x1 = this.state.x1;
    var x2 =0;
    var xm =0;
    var check = 0;
    var x0 =0;
    var i =0;
    var error = 1;
    var data = []
        data['x1'] = []
        data['x2'] = []
        data['error'] = []
        data['iteration'] = []

    check = this.func(x1)
    while(abs(check)>=0.000001){
      check = (this.func(x1)-parseFloat(x1))/this.func(x1);
      x2 = x1
      x1 = this.func(x1)
      error = this.error(x1,x2);
      data['iteration'][i] = i;
      data['x1'][i] = parseFloat(x1).toFixed(6);
      data['x2'][i] = parseFloat(x2).toFixed(6);
      data['error'][i] = error.toFixed(6);
      
      i++;
    }
    console.log(this.state);
    this.createTable(data['x2'], data['x1'], data['error']);
    this.setState({showTable:true,showGrap:true})
    this.Graph(data['x2'])
  }
 
    render(){
        let layout = {                     
            title: 'Onepoint',  
            xaxis: {                  
            title: 'X'         
            }
        };
        let config = {
            showLink: false,
            displayModeBar: true
        };

        const { size } = this.state;
        return (
            <div id="content" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            
                <Title style = {{textAlign: 'center'}}>One-point Iteration</Title>
                <br></br>                             
                
                <form style = {{textAlign: 'center'}}
                onSubmit={this.onInputChange}
                >
                <h1>Equation  : &nbsp;&nbsp;               
                    <Input size="large" placeholder="Input your Function" name = "fx"style={{ width: 500 }}
                    onChange={this.onInputChange}
                    />
                </h1>
                <br></br>
                <h1>Xi : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Input size="large" placeholder="Input your Xi" name = "xi"style={{ width: 500 }}
                    onChange={this.onInputChange}
                    />
                </h1>
                {/* <br></br>
                <h1>XR : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Input size="large" placeholder="Input your Xr" name = "xr"style={{ width: 500 }}
                    onChange={this.onInputChange}
                    />
                </h1>
                <br></br> */}
                
                <Button type="submit" shape="round"  size={size}
                style={{ color:'#ffffff',background:'#0F60F8'}}
                onClick={this.onSubmit}
                >
                    Submit
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="submit" shape="round"  size={size}
                style={{ color:'#ffffff',background:'#14BE08'}}
                onClick={this.onSubmit}
                >
                    Function
                </Button>
            </form>

            <div>
                <br></br>
                <br></br>
            {this.state.showTable == true ?
            <div>
            <h2 style = {{textAlign: 'center'}}>Table of Onepoint</h2>
            <h4 style = {{textAlign: 'center'}}> fx = {this.state.fx}
            <br></br> xl = {this.state.xl} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; xr = {this.state.xr}
            <Table columns={columns} dataSource={dataTable} size="middle" /></h4></div>:''}
            {this.state.showGrap == true ? 
                <PlotlyComponent  data={dataGraph} Layout={layout} config={config} /> : ''
            }
        
            </div>
                
        </div>
                
        );
    }
}

export default Onepoint;