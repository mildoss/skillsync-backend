import { Controller, Get, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RolesGuard } from "../auth/guards/roles-guard";

@ApiTags('Payments')
@Controller('payments')
@UseGuards(RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Listen to payments from Gateway (Kafka Event)' })
  @EventPattern('billing-payments-success')
  async handlePaymentSuccess(@Payload() message: any) {
    const paymentData = message.data;
    return await this.paymentsService.processSuccessfulPayment(paymentData);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get the current user payment history' })
  @ApiResponse({ status: 200, description: 'The transaction list has been successfully retrieved.' })
  async getMyTransactions(@CurrentUser() userId: string) {
    return this.paymentsService.getUserTransactions(userId);
  }
}