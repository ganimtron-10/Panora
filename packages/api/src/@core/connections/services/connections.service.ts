import { Injectable } from '@nestjs/common';
import { CrmConnectionsService } from './crm';
import { NotFoundError } from 'src/@core/utils/errors';
import { PrismaService } from 'src/@core/prisma/prisma.service';

@Injectable()
export class ConnectionsService {
  //STEP 1:[FRONTEND STEP]
  //create a frontend SDK snippet in which an authorization embedded link is set up  so when users click
  // on it to grant access => they grant US the access and then when confirmed
  /*const authUrl =
  'https://app.hubspot.com/oauth/authorize' +
  `?client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;*/ //oauth/callback

  // oauth server calls this redirect callback
  // WE WOULD HAVE CREATED A DEV ACCOUNT IN THE 5 CRMs (Panora dev account)
  // we catch the tmp token and swap it against oauth2 server for access/refresh tokens
  // to perform actions on his behalf
  // this call pass 1. integrationID 2. CustomerId 3. Panora Api Key
  constructor(
    private crmConnectionService: CrmConnectionsService,
    private prismaService: PrismaService,
  ) {}

  async handleCRMCallBack(
    projectId: string,
    customerId: string,
    providerName: string,
    code: string,
    zohoAccountURL?: string,
  ) {
    try {
      switch (providerName) {
        case 'hubspot':
          if (!code) {
            throw new NotFoundError('no hubspot code found');
          }
          return this.crmConnectionService.handleHubspotCallback(
            customerId,
            projectId,
            code,
          );
        case 'zoho':
          if (!code || !zohoAccountURL) {
            throw new NotFoundError('no zoho code/ zoho AccountURL found');
          }
          return this.crmConnectionService.handleZohoCallback(
            customerId,
            projectId,
            code,
            zohoAccountURL,
          );
        case 'pipedrive':
          if (!code) {
            throw new NotFoundError('no pipedrive code found');
          }
          return this.crmConnectionService.handlePipedriveCallback(
            customerId,
            projectId,
            code,
          );
        case 'freshsales':
          //todo: LATER
          break;
        case 'zendesk':
          if (!code) {
            throw new NotFoundError('no zendesk code found');
          }
          return this.crmConnectionService.handleZendeskCallback(
            customerId,
            projectId,
            code,
          );
        default:
          return;
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        console.log(error);
      }
      return error;
    }
  }

  async handleCRMTokensRefresh(customerId: string, providerId: string) {
    try {
      switch (providerId) {
        case 'hubspot':
          return this.crmConnectionService.handleHubspotTokenRefresh(
            customerId,
          );
        case 'zoho':
          return this.crmConnectionService.handleZohoTokenRefresh(customerId);
        case 'pipedrive':
          return this.crmConnectionService.handlePipedriveTokenRefresh(
            customerId,
          );
        case 'freshsales':
          //todo: LATER
          break;
        case 'zendesk':
          return this.crmConnectionService.handleZendeskTokenRefresh(
            customerId,
          );
        default:
          return;
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        console.log(error);
      }
      return error;
    }
  }
}
