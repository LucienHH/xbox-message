import { XboxMessage } from '..'

import { APIImagePart } from './Parts/ImagePart'
import { APITextPart } from './Parts/TextPart'

export interface MessagePayloadOptions {
  content?: string;
  attachment?: { data: Buffer; fileType: 'png' | 'jpg' | 'wav' | 'silk' | 'gif' | 'aac' }
}

export interface APIMessageBody {
  parts: Array<APITextPart | APIImagePart>;
}

export class MessagePayload {

  public client: XboxMessage

  public options: MessagePayloadOptions

  public body: APIMessageBody | null

  constructor(client: XboxMessage, options: MessagePayloadOptions) {

    this.client = client

    this.options = options

    this.body = null

  }

  parseContent(input: string): { parts: { contentType: string, version: number, text: string }[] } {
    const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g
    const parts: { contentType: string, version: number, text: string }[] = []

    let match
    let lastIndex = 0

    while ((match = urlPattern.exec(input)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          contentType: 'text',
          version: 0,
          text: input.slice(lastIndex, match.index),
        })
      }
      parts.push({
        contentType: 'weblink',
        version: 1,
        text: match[0],
      })
      lastIndex = urlPattern.lastIndex
    }

    if (lastIndex < input.length) {
      parts.push({
        contentType: 'text',
        version: 0,
        text: input.slice(lastIndex),
      })
    }

    return { parts }
  }


  public async resolveParts() {
    if (this.body) return this

    const parts = new Array<APITextPart | APIImagePart>()

    if (this.options.content) {
      const { parts: contentParts } = this.parseContent(this.options.content)

      parts.push(...contentParts)
    }

    if (this.options.attachment) {
      const attachment = await this.resolveFile(this.options.attachment)

      parts.push(attachment)
    }

    this.body = { parts }

    return this
  }

  async resolveFile(resource: { data: Buffer; fileType: 'png' | 'jpg' | 'wav' | 'silk' | 'gif' | 'aac' }) {

    const { uploadUri, attachmentId } = await this.client.rest.getUploadUrl(resource.fileType)
    const uploadBody = new Uint8Array(resource.data.byteLength)

    uploadBody.set(resource.data)

    const upload = await fetch(uploadUri, {
      method: 'PUT',
      body: uploadBody,
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'x-xbl-contract-version': '3',
        'Content-Type': 'application/octet-stream',
      },
    })

    if (!upload.ok) {
      const responseBody = await upload.text()
      const message = responseBody
        ? `Failed to upload attachment: ${upload.status} ${upload.statusText}: ${responseBody}`
        : `Failed to upload attachment: ${upload.status} ${upload.statusText}`

      throw new Error(message)
    }

    return {
      contentType: 'image',
      version: 0,
      attachmentId,
      filetype: resource.fileType,
      sizeInBytes: resource.data.byteLength,
      hash: upload.headers.get('content-md5') || '',
      height: 88,
      width: 88,
    }

  }

  static create(target: XboxMessage, options: string | MessagePayloadOptions) {
    return new this(
      target,
      typeof options !== 'object' || options === null ? { content: options } : { ...options },
    )
  }

}