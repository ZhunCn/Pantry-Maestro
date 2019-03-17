import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

class ExpirationChart extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartData:props.chartData
    }
  }

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right',
    pantry:'Hooters'
  }

  render(){
    return (
      <div className="chart">

        <Line
          data={this.state.chartData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Expiring Food Items In '+this.props.pantry,
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition
            }
          }}
        />

      </div>
    )
  }
}

export default ExpirationChart;
