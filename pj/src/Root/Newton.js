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
      dataIndex: 'x0',
      key : 'x0'
    },
    {
      title: 'X1',
      dataIndex: 'x1',
      key: 'x1'
    },
    {
      title: 'Error',
      dataIndex: 'error',
      key : 'error'
    },
];
var dataTable = [];

class Newton extends Component
{
  constructor() {
    super();
    this.state = {
      size: 'large',
    fx : "",
    x0 : 0,
    x1 : 0 ,
    showTable:false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


//   componentDidMount = async() => { 
//     await api.getFunctionByName("Bisection").then(db => {
//     this.setState({
//         fx:db.data.data.fx,
//         xr:db.data.data.xr,
//         xl:db.data.data.xl,
//     })
//     console.log(this.state.fx);
//     console.log(this.state.xl);
//     console.log(this.state.xr);
//     })
//   }
    Graph(X0)
    {
        dataGraph = [
        {
            type: 'scatter',  
            x: X0,        
            marker: {         
            color: '#3c753c'
            },
            name:'X0'
        },
        ];
        
    }
    error(x1,x2){
        return Math.abs((x2-x1)/x1);
    }

  
    createTable(x0,x1,error){
        dataTable =[];
        var i = 0;

        for (i=1;i<error.length;i++){
            dataTable.push({
                iteration: i ,
                x0: x0[i],
                x1: x1[i],
                error: error[i],
            });
        }
    }

    onInputChange = (event) =>{
        this.setState({
        [event.target.name]:event.target.value
        })
        console.log(this.state);
    }

    onSubmit (){
        var fx = this.state.fx;
        var x0 = this.state.x0;
        var x1 =0;
        var i =0;
        var error = 1;
        var A =0;
        var data = []
            data['x0'] = []
            data['x1'] = []
            data['error'] = []
            data['iteration'] = []

        // console.log("X0 ="+x0);
        // console.log("Fx ="+fx);
        // console.log("X1 ="+x1);
        A = this.func(x0)/this.diffunc(x0)
        x1 = x1 - A;
        console.log("A ="+A);
        console.log("X1 ="+x1);
        error = this.error(x1,x0);
        data['iteration'][i] = i;
        data['x0'][i] = parseFloat(x0).toFixed(6);
        data['x1'][i] = parseFloat(x1).toFixed(6);
        data['error'][i] = error.toFixed(6);
        
        x0 = x1;
        while(abs(A)>=0.000001 && i<20){
            i++;
            console.log("Iteration ="+i);

            A = this.func(x0)/this.diffunc(x0)
            x1 = x1 - A;
            error = this.error(x1,x0);
            data['iteration'][i] = i;
            data['x0'][i] = parseFloat(x0).toFixed(6);
            data['x1'][i] = parseFloat(x1).toFixed(6);
            data['error'][i] = error.toFixed(6);
            
            x0 = x1;
        }

        console.log(this.state);
        this.createTable(data['x0'], data['x1'], data['error']);
        this.setState({showTable:true,showGrap:true});
        this.Graph(data['x0']);

    }
    func(X) {  
        let scope = {x : parseFloat(X)};
        var expr = compile(this.state.fx);
        return expr.evaluate(scope);
    }
    diffunc(x){
        var expr = derivative(this.state.fx,'x');
        var scope = {x: parseFloat(x)};
        return expr.evaluate(scope);
    }
    render(){
        let layout = {                     
            title: 'Newton-Raphson',  
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
            
                <Title style = {{textAlign: 'center'}}>Newton-Raphson</Title>
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
                <h1>X : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Input size="large" placeholder="Input your X" name = "x"style={{ width: 500 }}
                    onChange={this.onInputChange}
                    />
                </h1>

                
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
            <h2 style = {{textAlign: 'center'}}>Table of Newton</h2>
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

export default Newton;