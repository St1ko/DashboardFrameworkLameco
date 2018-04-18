import React from 'react';
import _ from "lodash";
import {WidthProvider, Responsive} from 'react-grid-layout';
import Clock from './Clock.jsx';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || [];

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
			items: originalLayouts.map(function(i, key, list) {
				return {
					i: originalLayouts[key].i,
					x: originalLayouts[key].x,
					y: originalLayouts[key].y,
					w: originalLayouts[key].w,
					h: originalLayouts[key].h,
					widget: originalLayouts[key].widget,
				};
			}),
			selectedOption: '',
			newCounter: originalLayouts.length
		};

		this.onAddItem = this.onAddItem.bind(this);
		this.onBreakPointChange = this.onBreakPointChange.bind(this);
		this.onLayoutChange = this.onLayoutChange.bind(this);
		this.onLayoutReset = this.onLayoutReset.bind(this);
  }

	createElement(el) {
		const removeStyle = {
			position: 'absolute',
			right: '2px',
			top: 0,
			cursor: 'pointer'
		};
		const i = el.i;
		const widget = el.widget;

		return (
			<div key={i} data-grid={el}>
				<div className='widget'>
					{(() => {
						switch(widget) {
							case 'Clock':
								return <Clock/>;
							case 'Photo':
								return <div className='photo'></div>;
							default:
								return <span>{widget}</span>;
							}
						})()}
				</div>
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
		if(this.state.selectedOption) {
			console.log('adding', 'n' + this.state.newCounter + '; ' + this.state.selectedOption.value);
		} else {
			console.log('adding', 'n' + this.state.newCounter);
		}
		this.setState({
			items: this.state.items.concat({
				i: 'n' + this.state.newCounter,
				x: (this.state.items.length * 2) % (this.state.cols || 12),
				y: Infinity,
				w: 2,
				h: 2,
				widget: this.state.selectedOption ? this.state.selectedOption.value : '',
			}),
			newCounter: this.state.newCounter + 1
		});
	}

	onLayoutReset() {
		localStorage.clear();
		window.location.reload();
	}

	onBreakPointChange(breakpoint, cols) {
		this.setState({
			breakpoint: breakpoint,
			cols: cols
		});
	}

	onLayoutChange(layout) {
		this.setState({ layout: layout });
		/* add widget attribute from items array to objects in layout array,
		 * so that widgets are also saved to localStorage
		**/
		for (var i = 0; i < this.state.items.length; i++) {
			layout[i].widget = this.state.items[i].widget;
		}
		saveToLS('layouts', layout);
	}

	onRemoveItem(i) {
		this.setState({ items: _.reject(this.state.items, {i: i }) });
	}

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
		if (selectedOption) {
    console.log(`Selected: ${selectedOption.label}`);
		};
  }

  render() {
		const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;

    return (
		<div>
			<div className='widgetselecter'>
				<Select className='dropdown'
					name="form-field-name"
					value={value}
					onChange={this.handleChange}
					options={[
						{ value: 'one', label: 'One' },
						{ value: 'Photo', label: 'Photo' },
						{ value: 'Clock', label: 'Clock' },
					]}
					/>
				<button className='addButton' onClick={this.onAddItem}>Add Item</button>
				<button className='reset' onClick={this.onLayoutReset}>Reset Layout</button>
			</div>
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

//retreive layout from local storage
function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

//save layout to local storage
function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value
      })
    );
  }
}

export default Grid;
