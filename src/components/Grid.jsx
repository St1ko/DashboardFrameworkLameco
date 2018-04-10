import React from 'react';
import _ from "lodash";
import RGL, {WidthProvider} from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);
// var layout = [
// 	{i: 'a', x: 0, y: 0, w: 4, h: 2},
// 	{i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
// 	{i: 'c', x: 4, y: 0, w: 1, h: 2}
// ];
class Grid extends React.Component {
	static defaultProps = {
    className: "layout",
    items: 12,
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 12
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return _.map(_.range(this.props.items), function(i) {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

	onAddItem() {
		this.defaultProps.items++;
	}

  render() {
    // layout is an array of objects, see the demo for more complete usage
    return (
		<div>
			<button onClick={this.onAddItem.bind(this)}>Add Item</button>
			<ReactGridLayout layout={this.state.layout} onLayoutChange={this.onLayoutChange}
				{...this.props}>
				{this.generateDOM()}
			</ReactGridLayout>
		</div>
		);
  }
}

export default Grid;
