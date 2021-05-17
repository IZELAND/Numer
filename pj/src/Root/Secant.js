import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input ,Typography , Button,Table } from 'antd';
import {range, compile,evaluate,simplify,parse,abs} from 'mathjs'
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'
import axios from 'axios';

var api;

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
    title: 'X1',
    dataIndex: 'x1',
    key : 'x1'
  },

  {
    title: 'Error',
    dataIndex: 'error',
    key : 'error'
  },
];
var dataTable = [];

class Secant extends Component
{
  constructor() {
    super();
    this.state = {
      size: 'large',
    fx : "",
    x1 : 0,
    x2 : 0 ,
    x0 : 0,
    showTable:false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async dataapi() {
    await axios({method: "get",url: "http://localhost:5000/database/secant",}).then((response) => {console.log("response: ", response.data);api = response.data;});
    await this.setState({
      fx:api.fx,
      x1:api.x0,
      x2:api.x1
    })
    this.onSubmit()
  }

  Graph(x1, x2)
  {
        dataGraph = [
        {
          type: 'scatter',  
          x: x1,        
          marker: {         
            color: '#a32f0f'
          },
          name:'X1'
        },
        {
        type: 'scatter',  
        x: x2,        
        marker: {         
          color: '#3c753c'
        },
        name:'X2'
      }];
      
    }

    func(x) {  
      let scope = {x : parseFloat(x)};
      var expr = compile(this.state.fx);
      return expr.evaluate(scope)
  }

  error(x1,x2){
    return Math.abs((x2-x1)/x1);
}
  
  createTable(x1,x2,x0,error){
    dataTable =[]
    var i = 0;
    for (i=1;i<error.length;i++){
      dataTable.push({
        iteration: i ,
        x1: x1[i],
        x2: x2[i],
        x0: x0[i],
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
    var x2 = this.state.x2;
    var xm =0;
    var check = 0;
    var x0 =0;
    var i =0;
    var error = 1;
    var data = []
        data['x1'] = []
        data['x2'] = []
        data['x0'] = []
        data['error'] = []
        data['iteration'] = []

    if(this.func(x1)*this.func(x2)<0){
      do{
        x0 = ((parseFloat(x1)*this.func(x2))-(parseFloat(x2)*this.func(x1)))/(this.func(x2)-this.func(x1))
        check = this.func(x1)-this.func(x0)
        x1 = x2
        x2 = x0
        i++
        if(check == 0){
          break;
        }
        xm = ((parseFloat(x1)*this.func(x2))-(parseFloat(x2)*this.func(x1)))/(this.func(x2)-this.func(x1))
        error = this.error(xm,x0);
        
        data['iteration'][i] = i;
        data['x0'][i] = parseFloat(x0).toFixed(6);
        data['x1'][i] = parseFloat(x1).toFixed(6);
        data['x2'][i] = parseFloat(x2).toFixed(6);
        data['error'][i] = error.toFixed(6);
        
        
        console.log(data['x1']+" "+data['x2']);
      }while(error>=0.000001);
    }
    console.log(this.state);
    this.createTable(data['x1'], data['x2'], data['x0'], data['error']);
    this.setState({showTable:true,showGrap:true})
    this.Graph(data['x1'], data['x2'])
    //this.bisection(parseFloat(this.state.xl),parseFloat(this.state.xr));
  }
 
    render(){

      let layout = {                     
        title: 'Secant',  
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
          
          
            <Title style = {{textAlign: 'center'}}>Secant Method </Title>
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
              <h1>Xi-1 : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Input size="large" placeholder="Input your Xi-1" name = "x1"style={{ width: 500 }}
                onChange={this.onInputChange}
                />
              </h1>
              <br></br>
              <h1>Xi : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Input size="large" placeholder="Input your Xi" name = "x2"style={{ width: 500 }}
                onChange={this.onInputChange}
                />
              </h1>
              <br></br>
              
              <Button type="submit"   size={size}
              style={{ color:'#ffffff',background:'#0F60F8'}}
              onClick={()=>this.onSubmit()}>Submit
              </Button>

              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="submit"   size={size}
              style={{ color:'#ffffff',background:'#14BE08'}}
              onClick={()=>this.dataapi()}>Function
              </Button>

            </form>

            <div>
              <br></br>
              <br></br>
              {this.state.showTable === true ?
    <div>
    <h2 style = {{textAlign: 'center'}}>Table of Secant</h2>
    <h4 style = {{textAlign: 'center'}}> fx = {this.state.fx}
    <br></br> x(i-1) = {this.state.x1} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; x(i) = {this.state.x2}
    <Table columns={columns} dataSource={dataTable} size="middle" /></h4></div>:''}
    
    {/* {this.state.showGrap === true ? 
        <PlotlyComponent  data={dataGraph} Layout={layout} config={config} /> : ''
    } */}
    
    </div>
            
            </div>
            
          );
    }
}

export default Secant; 