import React from 'react'
import PropTypes from 'prop-types'
import Svg, { G, Line, Polygon } from 'react-native-svg'

const Diamond = ({ fill = '#333' }) => (
  <Svg height={22} width={22} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <G fill={fill} stroke={fill} strokeLinecap="round" strokeWidth="1.5">
      <Polygon fill="none" points="8 18 6 16 6 8 8 6 16 6 18 8 18 16 16 18 8 18"/>
			<Line fill="none" x1="6" x2="1" y1="8" y2="5.343"/>
			<Line fill="none" x1="8" x2="5.343" y1="6" y2="1"/>
			<Line fill="none" x1="16" x2="19" y1="6" y2="1"/>
			<Line fill="none" x1="18" x2="23" y1="8" y2="5"/>
			<Line fill="none" x1="8.039" x2="5" y1="18" y2="23"/>
			<Line fill="none" x1="6" x2="1" y1="16" y2="19"/>
			<Line fill="none" x1="16" x2="19" y1="18" y2="23"/>
			<Line fill="none" x1="18" x2="23" y1="16" y2="19"/>
			<Polygon fill="none" points="5 23 1 19 1 5 5 1 19 1 23 5 23 19 19 23 5 23" stroke={fill}/>
    </G>
  </Svg>
)

Diamond.propTypes = {
  fill: PropTypes.string,
}

export default Diamond
