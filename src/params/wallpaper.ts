export const defaultWallpapers = Array(6).fill(0).map((_item, index) => {
  return {
    id: `default-${index}`,
    image: `/assets/app-background-images/main_${index + 1}.png`,
  }
})
