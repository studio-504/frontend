import React from 'react'
import PromocodesComponent from 'components/Promocodes'
import PromocodesServiceComponent from 'components/Promocodes/index.service'

class PromocodesScreen extends React.Component {
  render() {
    return (
      <PromocodesServiceComponent>
        {(props) => (
          <PromocodesComponent
            {...props}
          />
        )}
      </PromocodesServiceComponent>
    )
  }
}

export default PromocodesScreen
