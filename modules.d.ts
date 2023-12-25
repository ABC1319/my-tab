declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $app: {
      context: string
      $message: any
    }
  }
}

// https://stackoverflow.com/a/64189046/479957
export {}
