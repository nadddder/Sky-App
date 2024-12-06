import { View, Text } from 'react-native'
import React from 'react'
import Body from 'react-native-body-highlighter'

const body = () => {
  return (
    <View className='flex items-center'>
      <Body
        data={[
          { slug: "chest", intensity: 1, side: "left" },
          { slug: "biceps", intensity: 2 },
        ]}
        gender="male"
        side="front"
        scale={1.7}
        border="#dfdfdf"
      />
    </View>
  )
}

export default body