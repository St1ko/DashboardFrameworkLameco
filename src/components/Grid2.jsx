import React from 'react';
import _ from "lodash";
import {WidthProvider, Responsive} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Grid extends React.PureComponent {
	static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
		rowHeight: 100,
  };

  constructor(props) {
    super(props);

    this.state = {
			items: [0, 1, 2, 3, 4].map(function(i, key, list) {
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
		const i = el.add ? '+' : el.i;
		return (
			<div key={i} data-grid={el}>
				{el.add ? (
					<span
						className='add text'
						onClick={this.onAddItem}
						title='You can add an item by clicking here, too.'>
						Add +
					</span>
				) : (
					<span className='text'>{i}</span>
				)}
				<span
					className='remove'
					style={removeStyle}
					onClick={this.onRemoveItem.bind(this, i)} >
					x
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
			<button onClick={this.onAddItem}>Add Item</button>
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
