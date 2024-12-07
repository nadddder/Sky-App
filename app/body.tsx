import { View, Text } from 'react-native'
import React from 'react'
import Body from 'react-native-body-highlighter'
import { Button } from '~/components/ui/button'
import { useRouter } from 'expo-router'
import { useBodyPainModal } from '~/hooks/body-pain/use-body-pain-modal'

const body = () => {
  const router = useRouter()
  const { open } = useBodyPainModal()
  return (
    <View className='flex flex-col items-center gap-2'>
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
      <Button className='bg-slate-300' onPress={() => router.push("/onboarding")}>Onboarding</Button>
      <Button className='bg-slate-400' onPress={() => { open("/") }} >Show Modal</Button>
    </View>
  )
}

export default body