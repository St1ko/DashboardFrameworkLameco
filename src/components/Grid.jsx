import React from 'react';
import _ from "lodash";
import {WidthProvider, Responsive} from 'react-grid-layout';
import Clock from './Clock.jsx'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Grid extends React.PureComponent {
	static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
		rowHeight: 100,
		autoSize: true,
  };

  constructor(props) {
    super(props);

    this.state = {
			items: [0, 1, 2].map(function(i, key, list) {
				return {
					i: i.toString(),
					x: i * 2,
					y: 0,
					w: 2,
					h: 2,
					add: i === (list.length - 1).toString()
				};
			}),
			newCounter: 0
		};

		this.onAddItem = this.onAddItem.bind(this);
		this.onBreakPointChange = this.onBreakPointChange.bind(this);
		this.onLayoutChange = this.onLayoutChange.bind(this);
  }

	createElement(el) {
		const removeStyle = {
			position: 'absolute',
			right: '2px',
			top: 0,
			cursor: 'pointer'
		};
		const i = el.i;
		return (
			<div key={i} data-grid={el}>
				<span className='text'>{i}</span>
				<Clock/>
				<span
					className='remove'
					style={removeStyle}
					onClick={this.onRemoveItem.bind(this, i)} >
					X
				</span>
			</div>
		);
	}

	onAddItem() {
		console.log('adding', 'n' + this.state.newCounter);
		this.setState({
			items: this.state.items.concat({
				i: 'n' + this.state.newCounter,
				x: (this.state.items.length * 2) % (this.state.cols || 12),
				y: Infinity,
				w: 2,
				h: 2
			}),
			newCounter: this.state.newCounter + 1
		});
	}

	onBreakPointChange(breakpoint, cols) {
		this.setState({
			breakpoint: breakpoint,
			cols: cols
		});
	}

	onLayoutChange(layout) {
		//this.props.onLayoutChange(layout);
		this.setState({ layout: layout });
	}

	onRemoveItem(i) {
		console.log('removing', i);
		this.setState({ items: _.reject(this.state.items, {i: i }) });
	}

  render() {
    // layout is an array of objects, see the demo for more complete usage
    return (
		<div>
			<button className='addButton' onClick={this.onAddItem}>Add Item</button>
			<ResponsiveReactGridLayout
				onLayoutChange={this.onLayoutChange}
				onBreakPointChange={this.onBreakPointChange}
				{...this.props}>
				{_.map(this.state.items, el => this.createElement(el))}
			</ResponsiveReactGridLayout>
		</div>
		);
  }
}

export default Grid;
