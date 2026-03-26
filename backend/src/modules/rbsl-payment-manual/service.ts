import { 
  AbstractPaymentProvider,
} from "@medusajs/framework/utils"

class RBSLPaymentService extends AbstractPaymentProvider {
  static identifier = "rbsl-bank-transfer"

  constructor(container: any, config: any) {
    super(container, config)
  }

  async capturePayment(input: any): Promise<any> {
    return { status: "captured" }
  }

  async authorizePayment(input: any): Promise<any> {
    return {
      data: input.data,
      status: "authorized"
    }
  }

  async cancelPayment(input: any): Promise<any> {
    return { status: "canceled" }
  }

  async initiatePayment(input: any): Promise<any> {
    return {
      data: {},
      status: "pending"
    }
  }

  async deletePayment(input: any): Promise<any> {
    return {}
  }

  async getPaymentStatus(input: any): Promise<any> {
    return "pending"
  }

  async refundPayment(input: any): Promise<any> {
    return { status: "refunded" }
  }

  async retrievePayment(input: any): Promise<any> {
    return input.data
  }

  async updatePayment(input: any): Promise<any> {
    return {
      data: {},
      status: "pending"
    }
  }

  async getWebhookActionAndData(data: any): Promise<any> {
    return {
      action: "not_supported",
      data: {}
    }
  }
}

export default RBSLPaymentService
