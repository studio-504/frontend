import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import Svg, { G, Path, Circle } from 'react-native-svg'

const Coupon = ({ fill = '#333', size }) => {
  const styling = styles(size)

  return (
    <View style={styling}>
      <Svg height="100%" viewBox="0 0 24 24" width="100%" xmlns="http://www.w3.org/2000/svg">
        <G stroke={fill} strokeLinecap="square" transform="translate(.5 .5)">
          <Path
            d="m20 12c0-1.7 1.3-3 3-3v-5h-22v5c1.7 0 3 1.3 3 3s-1.3 3-3 3v5h22v-5c-1.7 0-3-1.3-3-3z"
            fill="none"
            stroke={fill}
            strokeMiterlimit="10"
          />
          <Path d="m15 9-6 6" fill="none" strokeMiterlimit="10" />
          <G stroke={fill}>
            <Circle cx="9.5" cy="8.5" r="1.5" />
            <Circle cx="14.5" cy="15.5" r="1.5" />
          </G>
        </G>
      </Svg>
    </View>
  )
}

const styles = (size) =>
  StyleSheet.create({
    width: size,
    height: size,
  })

Coupon.propTypes = {
  fill: PropTypes.string,
  size: PropTypes.number,
}

Coupon.defaultProps = {
  fill: PropTypes.string,
  size: 24,
}

export default Coupon
