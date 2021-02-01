import Base from '@src/common/base'
import { loadImage } from '@src/utils'

export default abstract class Mask<Options> extends Base<Options> {
  // 遮罩图像对象
  protected maskImage?: HTMLImageElement

  // 已经加载成功的图像列表
  private completedMap!: {
    [key: string]: HTMLImageElement
  }

  /**
   * 加载遮罩图像
   * @TODO 加载错误重试
   */
  protected loadMaskImage(): void {
    const maskUrl = (this.options as { mask?: string }).mask

    if (!maskUrl) return

    // 初始化 completedMap 对象
    if (!this.completedMap) {
      this.completedMap = {}
    }

    // 取缓存图像
    if (this.completedMap[maskUrl]) {
      this.maskImage = this.completedMap[maskUrl]
      return
    }

    loadImage(maskUrl, (image) => {
      this.completedMap[maskUrl] = image
      this.maskImage = image
    })
  }

  /**
   * 绘制遮罩
   */
  protected drawMask(): void {
    if (!this.maskImage) return

    // 绘制遮罩图案
    this.drawMaskImage()

    // 设置图形组合模式，将效果映射到遮罩内
    this.ctx.globalCompositeOperation = 'source-atop'
  }

  /**
   * 绘制遮罩图案，遮罩图像填充模式为 contain 且居中
   */
  private drawMaskImage(): void {
    if (!this.maskImage) return

    const { ctx, canvasWidth, canvasHeight, maskImage } = this
    const imgWidth = maskImage.naturalWidth
    const imgHeight = maskImage.naturalHeight
    const imgScale = imgWidth / imgHeight

    // 图像填充算法: contain 模式
    let width = imgWidth > canvasWidth ? canvasWidth : imgWidth
    let height = imgHeight > canvasHeight ? canvasHeight : imgHeight

    if (imgWidth > imgHeight) {
      height = width / imgScale
    } else {
      width = height * imgScale
    }

    // 居中处理
    const x = (canvasWidth - width) / 2
    const y = (canvasHeight - height) / 2

    ctx.drawImage(maskImage, 0, 0, imgWidth, imgHeight, x, y, width, height)
  }
}
