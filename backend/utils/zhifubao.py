#!/usr/bin/env python
# -*- coding: utf-8 -*-
import logging

from alipay.aop.api.AlipayClientConfig import AlipayClientConfig
from alipay.aop.api.DefaultAlipayClient import DefaultAlipayClient
from alipay.aop.api.domain.AlipayTradePagePayModel import AlipayTradePagePayModel
from alipay.aop.api.request.AlipayTradePagePayRequest import AlipayTradePagePayRequest
from alipay.aop.api.util.SignatureUtils import verify_with_rsa
from backend.settings import (
    ALIPAY_APP_ID,
    ALIPAY_APP_PRIVATE_KEY,
    ALIPAY_PUBLIC_KEY,
    ALIPAY_SERVER_URL,
    ALIPAY_RETURN_URL,
    ALIPAY_NOTIFY_URL,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    filemode="a",
)
logger = logging.getLogger("")


class Alipay:
    """
    设置配置，包括支付宝网关地址、app_id、应用私钥、支付宝公钥等，其他配置值可以查看AlipayClientConfig的定义。
    """

    def __init__(self):
        # 将配置对象改为实例变量，避免共享问题
        self.alipay_client_config = AlipayClientConfig()
        self.alipay_client_config.server_url = ALIPAY_SERVER_URL
        self.alipay_client_config.app_id = ALIPAY_APP_ID
        self.alipay_client_config.app_private_key = ALIPAY_APP_PRIVATE_KEY
        self.alipay_client_config.alipay_public_key = ALIPAY_PUBLIC_KEY
        """
        得到客户端对象。
        注意，一个alipay_client_config对象对应一个DefaultAlipayClient，定义DefaultAlipayClient对象后，alipay_client_config不得修改，如果想使用不同的配置，请定义不同的DefaultAlipayClient。
        logger参数用于打印日志，不传则不打印，建议传递。
        """
        self.client = DefaultAlipayClient(
            alipay_client_config=self.alipay_client_config, logger=logger
        )

    def verify_sign(self, unsigned_string, sign):
        """验签的自定义函数,调用alipay的verify_with_rsa方法"""
        return verify_with_rsa(
            ALIPAY_PUBLIC_KEY, bytes(unsigned_string, encoding="utf-8"), sign
        )

    def trade_page(
        self,
        out_trade_no,
        total_amount,
        subject,
        body,
        product_code="FAST_INSTANT_TRADE_PAY",
    ):
        """
        页面接口示例：alipay.trade.page.pay
        """
        # 对照接口文档，构造请求对象
        model = AlipayTradePagePayModel()
        model.out_trade_no = out_trade_no
        model.total_amount = total_amount
        model.subject = subject
        model.body = body
        model.product_code = product_code
        request = AlipayTradePagePayRequest(biz_model=model)

        # 设置回调URL
        request.notify_url = ALIPAY_NOTIFY_URL
        request.return_url = ALIPAY_RETURN_URL

        # 得到构造的请求，如果http_method是GET，则是一个带完成请求参数的url，如果http_method是POST，则是一段HTML表单片段
        response = self.client.page_execute(request, http_method="GET")
        return response
