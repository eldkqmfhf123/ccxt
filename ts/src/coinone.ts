
//  ---------------------------------------------------------------------------

import { sha512 } from '@noble/hashes/sha2.js';
import Exchange from './abstract/coinone.js';
import { BadSymbol, BadRequest, ExchangeError, ArgumentsRequired, OrderNotFound, OnMaintenance } from './base/errors.js';
import { Precise } from './base/Precise.js';
import { TICK_SIZE } from './base/functions/number.js';
import type { Balances, Currencies, CurrencyInterface, DepositAddress, Dict, Int, List, Market, NullableDict, FeeString, Num, Order, OrderBook, OrderSide, OrderType, Str, Strings, Ticker, Tickers, Trade, int, Endpoint } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class coinone
 * @augments Exchange
 */
export default class coinone extends Exchange {
    override describe (): Dict {
        return this.deepExtend (super.describe (), {
            'id': 'coinone',
            'name': 'CoinOne',
            'countries': [ 'KR' ], // Korea
            'rateLimit': 50,
            'version': 'v2',
            'pro': false,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowCrossMargin': false,
                'borrowIsolatedMargin': false,
                'borrowMargin': false,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'closeAllPositions': false,
                'closePosition': false,
                'createMarketOrder': false,
                'createOrder': true,
                'createOrderWithTakeProfitAndStopLoss': false,
                'createOrderWithTakeProfitAndStopLossWs': false,
                'createPostOnlyOrder': false,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'fetchBalance': true,
                'fetchBorrowInterest': false,
                'fetchBorrowRate': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchBorrowRates': false,
                'fetchBorrowRatesPerSymbol': false,
                'fetchClosedOrders': false, // the endpoint that should return closed orders actually returns trades, https://github.com/ccxt/ccxt/pull/7067
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': true,
                'fetchDepositAddress': false,
                'fetchDepositAddresses': true,
                'fetchDepositAddressesByNetwork': false,
                'fetchFundingHistory': false,
                'fetchFundingInterval': false,
                'fetchFundingIntervals': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchGreeks': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchIsolatedPositions': false,
                'fetchLeverage': false,
                'fetchLeverages': false,
                'fetchLeverageTiers': false,
                'fetchLiquidations': false,
                'fetchLongShortRatio': false,
                'fetchLongShortRatioHistory': false,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarginMode': false,
                'fetchMarginModes': false,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMarkPrices': false,
                'fetchMyLiquidations': false,
                'fetchMySettlementHistory': false,
                'fetchMyTrades': true,
                'fetchOpenInterest': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenInterests': false,
                'fetchOpenOrders': true,
                'fetchOption': false,
                'fetchOptionChain': false,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchPosition': false,
                'fetchPositionHistory': false,
                'fetchPositionMode': false,
                'fetchPositions': false,
                'fetchPositionsForSymbol': false,
                'fetchPositionsHistory': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchSettlementHistory': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTrades': true,
                'fetchVolatilityHistory': false,
                'reduceMargin': false,
                'repayCrossMargin': false,
                'repayIsolatedMargin': false,
                'repayMargin': false,
                'setLeverage': false,
                'setMargin': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'ws': true,
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/38003300-adc12fba-323f-11e8-8525-725f53c4a659.jpg',
                'api': {
                    'rest': 'https://api.coinone.co.kr',
                    'v2Public': 'https://api.coinone.co.kr/public/v2',
                    'v2Private': 'https://api.coinone.co.kr/v2',
                    'v2_1Private': 'https://api.coinone.co.kr/v2.1',
                },
                'www': 'https://coinone.co.kr',
                'doc': 'https://docs.coinone.co.kr',
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
            },
            'api': {
                'public': {
                    'get': {
                        'orderbook': { 'cost': 1 } as Endpoint<Dict>,
                        'ticker': { 'cost': 1 } as Endpoint<Dict>,
                        'ticker_utc': { 'cost': 1 } as Endpoint<Dict>,
                        'trades': { 'cost': 1 } as Endpoint<Dict>,
                    },
                },
                'v2Public': {
                    'get': {
                        'range_units': { 'cost': 1 } as Endpoint<Dict>,
                        'range_units/{quote_currency}/{target_currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'markets/{quote_currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'markets/{quote_currency}/{target_currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'orderbook/{quote_currency}/{target_currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'trades/{quote_currency}/{target_currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'ticker_new/{quote_currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'ticker_new/{quote_currency}/{target_currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'ticker_utc_new/{quote_currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'ticker_utc_new/{quote_currency}/{target_currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'currencies': { 'cost': 1 } as Endpoint<Dict>,
                        'currencies/{currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'chart/{quote_currency}/{target_currency}': { 'cost': 1 } as Endpoint<Dict>,
                    },
                },
                'private': {
                    'post': {
                        'account/deposit_address': { 'cost': 1 } as Endpoint<Dict>,
                        'account/btc_deposit_address': { 'cost': 1 } as Endpoint<Dict>,
                        'account/balance': { 'cost': 1 } as Endpoint<Dict>,
                        'account/daily_balance': { 'cost': 1 } as Endpoint<Dict>,
                        'account/user_info': { 'cost': 1 } as Endpoint<Dict>,
                        'account/virtual_account': { 'cost': 1 } as Endpoint<Dict>,
                        'order/cancel_all': { 'cost': 1 } as Endpoint<Dict>,
                        'order/cancel': { 'cost': 1 } as Endpoint<Dict>,
                        'order/limit_buy': { 'cost': 1 } as Endpoint<Dict>,
                        'order/limit_sell': { 'cost': 1 } as Endpoint<Dict>,
                        'order/complete_orders': { 'cost': 1 } as Endpoint<Dict>,
                        'order/limit_orders': { 'cost': 1 } as Endpoint<Dict>,
                        'order/order_info': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/auth_number': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/history': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/krw/history': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/btc': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/coin': { 'cost': 1 } as Endpoint<Dict>,
                    },
                },
                'v2Private': {
                    'post': {
                        'account/balance': { 'cost': 1 } as Endpoint<Dict>,
                        'account/deposit_address': { 'cost': 1 } as Endpoint<Dict>,
                        'account/user_info': { 'cost': 1 } as Endpoint<Dict>,
                        'account/virtual_account': { 'cost': 1 } as Endpoint<Dict>,
                        'order/cancel': { 'cost': 1 } as Endpoint<Dict>,
                        'order/limit_buy': { 'cost': 1 } as Endpoint<Dict>,
                        'order/limit_sell': { 'cost': 1 } as Endpoint<Dict>,
                        'order/limit_orders': { 'cost': 1 } as Endpoint<Dict>,
                        'order/complete_orders': { 'cost': 1 } as Endpoint<Dict>,
                        'order/query_order': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/auth_number': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/btc': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/history': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/krw/history': { 'cost': 1 } as Endpoint<Dict>,
                    },
                },
                'v2_1Private': {
                    'post': {
                        'account/balance/all': { 'cost': 1 } as Endpoint<Dict>,
                        'account/balance': { 'cost': 1 } as Endpoint<Dict>,
                        'account/deposit_address': { 'cost': 1 } as Endpoint<Dict>,
                        'account/trade_fee': { 'cost': 1 } as Endpoint<Dict>,
                        'account/trade_fee/{quote_currency}/{target_currency}': { 'cost': 1 } as Endpoint<Dict>,
                        'order': { 'cost': 1 } as Endpoint<Dict>,
                        'order/limit': { 'cost': 1 } as Endpoint<Dict>,
                        'order/cancel': { 'cost': 1 } as Endpoint<Dict>,
                        'order/cancel/all': { 'cost': 1 } as Endpoint<Dict>,
                        'order/open_orders': { 'cost': 1 } as Endpoint<Dict>,
                        'order/open_orders/all': { 'cost': 1 } as Endpoint<Dict>,
                        'order/active_orders': { 'cost': 1 } as Endpoint<Dict>,
                        'order/complete_orders': { 'cost': 1 } as Endpoint<Dict>,
                        'order/complete_orders/all': { 'cost': 1 } as Endpoint<Dict>,
                        'order/completed_orders': { 'cost': 1 } as Endpoint<Dict>,
                        'order/completed_orders/all': { 'cost': 1 } as Endpoint<Dict>,
                        'order/info': { 'cost': 1 } as Endpoint<Dict>,
                        'order/detail': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/krw/history': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/coin/history': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/coin/history/detail': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/coin/withdrawal': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/coin/withdrawal/address_book': { 'cost': 1 } as Endpoint<Dict>,
                        'transaction/coin/withdrawal/limit': { 'cost': 1 } as Endpoint<Dict>,
                        'event/order-reward/programs': { 'cost': 1 } as Endpoint<Dict>,
                        'event/order-reward/history': { 'cost': 1 } as Endpoint<Dict>,
                    },
                },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'taker': 0.002,
                    'maker': 0.002,
                },
            },
            'features': {
                'spot': {
                    'sandbox': false,
                    'createOrder': {
                        'marginMode': false,
                        'triggerPrice': false,
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': false,
                        'takeProfitPrice': false,
                        'attachedStopLossTakeProfit': undefined,
                        'timeInForce': {
                            'IOC': false,
                            'FOK': false,
                            'PO': false,
                            'GTD': false,
                        },
                        'hedged': false,
                        'trailing': false,
                        'leverage': false,
                        'marketBuyByCost': false,
                        'marketBuyRequiresPrice': false,
                        'selfTradePrevention': false,
                        'iceberg': false,
                    },
                    'createOrders': undefined,
                    'fetchMyTrades': {
                        'marginMode': false,
                        'limit': 100,
                        'daysBack': 100000, // todo implement
                        'untilDays': 90,
                        'symbolRequired': false,
                    },
                    'fetchOrder': {
                        'marginMode': false,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'limit': undefined,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOrders': undefined,
                    'fetchClosedOrders': undefined, // todo implement
                    'fetchOHLCV': undefined, // todo implement
                },
                'swap': {
                    'linear': undefined,
                    'inverse': undefined,
                },
                'future': {
                    'linear': undefined,
                    'inverse': undefined,
                },
            },
            'precisionMode': TICK_SIZE,
            'exceptions': {
                '104': OrderNotFound,
                '107': BadRequest,
                '108': BadSymbol,
                '405': OnMaintenance,
            },
            'commonCurrencies': {
                'SOC': 'Soda Coin',
            },
        });
    }

    /**
     * @method
     * @name coinone#fetchCurrencies
     * @description fetches all available currencies on an exchange
     * @see https://docs.coinone.co.kr/reference/currencies
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an associative dictionary of currencies
     */
    override async fetchCurrencies (params: Dict = {}): Promise<Currencies> {
        const response = await this.v2PublicGetCurrencies (params);
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "server_time": 1701054555578,
        //         "currencies": [
        //           {
        //             "name": "Polygon",
        //             "symbol": "MATIC",
        //             "deposit_status": "normal",
        //             "withdraw_status": "normal",
        //             "deposit_confirm_count": 150,
        //             "max_precision": 8,
        //             "deposit_fee": "0.0",
        //             "withdrawal_min_amount": "1.0",
        //             "withdrawal_fee": "3.0"
        //           }
        //         ]
        //     }
        //
        const currencies = this.safeList (response, 'currencies', []);
        return this.parseCurrencies (currencies);
    }

    override parseCurrency (rawCurrency: Dict): CurrencyInterface {
        const id = this.safeString (rawCurrency, 'symbol');
        const code = this.safeCurrencyCode (id);
        const isWithdrawEnabled = this.safeString (rawCurrency, 'withdraw_status', '') === 'normal';
        const isDepositEnabled = this.safeString (rawCurrency, 'deposit_status', '') === 'normal';
        let type: Str = 'fiat';
        if (code !== 'KRW') {
            type = 'crypto';
        }
        return this.safeCurrencyStructure ({
            'id': id,
            'code': code,
            'info': rawCurrency,
            'name': this.safeString (rawCurrency, 'name'),
            'active': undefined,
            'deposit': isDepositEnabled,
            'withdraw': isWithdrawEnabled,
            'fee': this.safeNumber (rawCurrency, 'withdrawal_fee'),
            'precision': this.parseNumber (this.parsePrecision (this.safeString (rawCurrency, 'max_precision'))),
            'limits': {
                'amount': {
                    'min': undefined,
                    'max': undefined,
                },
                'withdraw': {
                    'min': this.safeNumber (rawCurrency, 'withdrawal_min_amount'),
                    'max': undefined,
                },
            },
            'networks': {},
            'type': type,
        });
    }

    /**
     * @method
     * @name coinone#fetchMarkets
     * @description retrieves data on all markets for coinone
     * @see https://docs.coinone.co.kr/reference/tickers
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    override async fetchMarkets (params: Dict = {}): Promise<Market[]> {
        const request: Dict = {
            'quote_currency': 'KRW',
        };
        const response = await this.v2PublicGetTickerNewQuoteCurrency (request);
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "server_time": 1701067923060,
        //         "tickers": [
        //             {
        //                 "quote_currency": "krw",
        //                 "target_currency": "stg",
        //                 "timestamp": 1701067920001,
        //                 "high": "667.5",
        //                 "low": "667.5",
        //                 "first": "667.5",
        //                 "last": "667.5",
        //                 "quote_volume": "0.0",
        //                 "target_volume": "0.0",
        //                 "best_asks": [
        //                     {
        //                         "price": "777.0",
        //                         "qty": "73.9098"
        //                     }
        //                 ],
        //                 "best_bids": [
        //                     {
        //                         "price": "690.8",
        //                         "qty": "40.7768"
        //                     }
        //                 ],
        //                 "id": "1701067920001001"
        //             }
        //         ]
        //     }
        //
        const tickers = this.safeList (response, 'tickers', []);
        const result: List = [];
        for (let i = 0; i < tickers.length; i++) {
            const entry = this.safeDict (tickers, i);
            const id = this.safeString (entry, 'id');
            const baseId = this.safeStringUpper (entry, 'target_currency');
            const quoteId = this.safeStringUpper (entry, 'quote_currency');
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            if ((base === undefined) || (quote === undefined)) {
                continue;
            }
            result.push ({
                'id': id,
                'symbol': base + '/' + quote,
                'base': base,
                'quote': quote,
                'settle': undefined,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': undefined,
                'type': 'spot',
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'active': undefined,
                'contract': false,
                'linear': undefined,
                'inverse': undefined,
                'contractSize': undefined,
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': this.parseNumber ('1e-4'),
                    'price': this.parseNumber ('1e-4'),
                    'cost': this.parseNumber ('1e-8'),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'created': undefined,
                'info': entry,
            });
        }
        return result;
    }

    override parseBalance (response: Dict): Balances {
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "balances": [
        //             {
        //                 "available": "998999692485",
        //                 "limit": "0",
        //                 "average_price": "100000000",
        //                 "currency": "BTC"
        //             }
        //         ]
        //     }
        //
        const result: Dict = { 'info': response };
        const balances = this.safeList (response, 'balances', []);
        for (let i = 0; i < balances.length; i++) {
            const balance = balances[i];
            const currencyId = this.safeString (balance, 'currency');
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            account['free'] = this.safeString (balance, 'available');
            account['used'] = this.safeString (balance, 'limit');
            if (code !== undefined) {
                result[code] = account;
            }
        }
        return this.safeBalance (result);
    }

    /**
     * @method
     * @name coinone#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @see https://docs.coinone.co.kr/reference/find-balance
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/?id=balance-structure}
     */
    override async fetchBalance (params: Dict = {}): Promise<Balances> {
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const response = await this.v2_1PrivatePostAccountBalanceAll (params);
        return this.parseBalance (response);
    }

    /**
     * @method
     * @name coinone#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @see https://docs.coinone.co.kr/reference/orderbook
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order book structure]{@link https://docs.ccxt.com/?id=order-book-structure}
     */
    override async fetchOrderBook (symbol: string, limit: Int = undefined, params: Dict = {}): Promise<OrderBook> {
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const market = this.market (symbol);
        const request: Dict = {
            'quote_currency': market['quote'],
            'target_currency': market['base'],
        };
        if (limit !== undefined) {
            request['size'] = limit; // only support 5, 10, 15, 16
        }
        const response = await this.v2PublicGetOrderbookQuoteCurrencyTargetCurrency (this.extend (request, params));
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "timestamp": 1701071108673,
        //         "id": "1701071108673001",
        //         "quote_currency": "KRW",
        //         "target_currency": "BTC",
        //         "order_book_unit": "0.0",
        //         "bids": [
        //             {
        //                 "price": "50048000",
        //                 "qty": "0.01080229"
        //             }
        //         ],
        //         "asks": [
        //             {
        //                 "price": "50058000",
        //                 "qty": "0.00272592"
        //             }
        //         ]
        //     }
        //
        const timestamp = this.safeInteger (response, 'timestamp');
        return this.parseOrderBook (response, market['symbol'], timestamp, 'bids', 'asks', 'price', 'qty');
    }

    /**
     * @method
     * @name coinone#fetchTickers
     * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
     * @see https://docs.coinone.co.kr/reference/tickers
     * @see https://docs.coinone.co.kr/reference/ticker
     * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/?id=ticker-structure}
     */
    override async fetchTickers (symbols: Strings = undefined, params: Dict = {}): Promise<Tickers> {
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const symbolsNormalized: Strings = this.marketSymbols (symbols);
        const request: Dict = {
            'quote_currency': 'KRW',
        };
        let market: Market = undefined;
        let response = undefined;
        if (symbolsNormalized !== undefined) {
            const first = this.safeString (symbolsNormalized, 0);
            market = this.market (first);
            request['quote_currency'] = market['quote'];
            request['target_currency'] = market['base'];
            response = await this.v2PublicGetTickerNewQuoteCurrencyTargetCurrency (this.extend (request, params));
        } else {
            response = await this.v2PublicGetTickerNewQuoteCurrency (this.extend (request, params));
        }
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "server_time": 1701073358487,
        //         "tickers": [
        //             {
        //                 "quote_currency": "krw",
        //                 "target_currency": "btc",
        //                 "timestamp": 1701073357818,
        //                 "high": "50543000.0",
        //                 "low": "49945000.0",
        //                 "first": "50487000.0",
        //                 "last": "50062000.0",
        //                 "quote_volume": "11349804285.3859",
        //                 "target_volume": "226.07268994",
        //                 "best_asks": [
        //                     {
        //                         "price": "50081000.0",
        //                         "qty": "0.18471358"
        //                     }
        //                 ],
        //                 "best_bids": [
        //                     {
        //                         "price": "50062000.0",
        //                         "qty": "0.04213455"
        //                     }
        //                 ],
        //                 "id": "1701073357818001"
        //             }
        //         ]
        //     }
        //
        const data: Dict[] = this.safeList (response, 'tickers', []);
        return this.parseTickers (data, symbolsNormalized);
    }

    /**
     * @method
     * @name coinone#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://docs.coinone.co.kr/reference/ticker
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/?id=ticker-structure}
     */
    override async fetchTicker (symbol: string, params: Dict = {}): Promise<Ticker> {
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const market = this.market (symbol);
        const request: Dict = {
            'quote_currency': market['quote'],
            'target_currency': market['base'],
        };
        const response = await this.v2PublicGetTickerNewQuoteCurrencyTargetCurrency (this.extend (request, params));
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "server_time": 1701073358487,
        //         "tickers": [
        //             {
        //                 "quote_currency": "krw",
        //                 "target_currency": "btc",
        //                 "timestamp": 1701073357818,
        //                 "high": "50543000.0",
        //                 "low": "49945000.0",
        //                 "first": "50487000.0",
        //                 "last": "50062000.0",
        //                 "quote_volume": "11349804285.3859",
        //                 "target_volume": "226.07268994",
        //                 "best_asks": [
        //                     {
        //                         "price": "50081000.0",
        //                         "qty": "0.18471358"
        //                     }
        //                 ],
        //                 "best_bids": [
        //                     {
        //                         "price": "50062000.0",
        //                         "qty": "0.04213455"
        //                     }
        //                 ],
        //                 "id": "1701073357818001"
        //             }
        //         ]
        //     }
        //
        const data = this.safeList (response, 'tickers', []);
        const ticker = this.safeDict (data, 0, {});
        return this.parseTicker (ticker, market);
    }

    override parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        //
        //     {
        //         "quote_currency": "krw",
        //         "target_currency": "btc",
        //         "timestamp": 1701073357818,
        //         "high": "50543000.0",
        //         "low": "49945000.0",
        //         "first": "50487000.0",
        //         "last": "50062000.0",
        //         "quote_volume": "11349804285.3859",
        //         "target_volume": "226.07268994",
        //         "best_asks": [
        //             {
        //                 "price": "50081000.0",
        //                 "qty": "0.18471358"
        //             }
        //         ],
        //         "best_bids": [
        //             {
        //                 "price": "50062000.0",
        //                 "qty": "0.04213455"
        //             }
        //         ],
        //         "id": "1701073357818001"
        //     }
        //
        const timestamp = this.safeInteger (ticker, 'timestamp');
        const last = this.safeString (ticker, 'last');
        const asks = this.safeList (ticker, 'best_asks', []);
        const bids = this.safeList (ticker, 'best_bids', []);
        const baseId = this.safeString (ticker, 'target_currency');
        const quoteId = this.safeString (ticker, 'quote_currency');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        let symbol: Str = undefined;
        if ((base !== undefined) && (quote !== undefined)) {
            symbol = base + '/' + quote;
        }
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString (ticker, 'high'),
            'low': this.safeString (ticker, 'low'),
            'bid': this.safeString (bids, 'price'),
            'bidVolume': this.safeString (bids, 'qty'),
            'ask': this.safeString (asks, 'price'),
            'askVolume': this.safeString (asks, 'qty'),
            'vwap': undefined,
            'open': this.safeString (ticker, 'first'),
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeString (ticker, 'target_volume'),
            'quoteVolume': this.safeString (ticker, 'quote_volume'),
            'info': ticker,
        }, market);
    }

    override parseTrade (trade: Dict, market: Market = undefined): Trade {
        //
        // fetchTrades (public)
        //
        //     {
        //         "id": "1701075265708001",
        //         "timestamp": 1701075265708,
        //         "price": "50020000",
        //         "qty": "0.00155177",
        //         "is_seller_maker": false
        //     }
        //
        // fetchMyTrades (private)
        //
        //     {
        //         "trade_id": "0e2bb80f-1e4d-11e9-9ec7-00e04c3600d1",
        //         "order_id": "0e2b9627-1e4d-11e9-9ec7-00e04c3600d2",
        //         "quote_currency": "KRW",
        //         "target_currency": "BTC",
        //         "order_type": "LIMIT",
        //         "is_ask": true,
        //         "is_maker": true,
        //         "price": "8420",
        //         "qty": "0.1599",
        //         "timestamp": 1761300000000,
        //         "fee_rate": "0.001",
        //         "fee": "162",
        //         "fee_currency": "KRW"
        //     }
        //
        const timestamp = this.safeInteger (trade, 'timestamp');
        const base = this.safeCurrencyCode (this.safeString (trade, 'target_currency'));
        const quote = this.safeCurrencyCode (this.safeString (trade, 'quote_currency'));
        let symbol: Str = undefined;
        if ((base !== undefined) && (quote !== undefined)) {
            symbol = base + '/' + quote;
        }
        const marketResolved: Market = (symbol !== undefined) ? this.safeMarket (symbol, market, '/') : this.safeMarket (undefined, market);
        let side: Str = undefined;
        const isSellerMaker = this.safeBool (trade, 'is_seller_maker');
        const isAsk = this.safeBool (trade, 'is_ask');
        if (isSellerMaker !== undefined) {
            side = isSellerMaker ? 'sell' : 'buy';
        } else if (isAsk !== undefined) {
            side = isAsk ? 'sell' : 'buy';
        }
        let takerOrMaker: Str = undefined;
        const isMaker = this.safeBool (trade, 'is_maker');
        if (isMaker !== undefined) {
            takerOrMaker = isMaker ? 'maker' : 'taker';
        }
        const orderType = this.safeString (trade, 'order_type');
        const types: Dict = {
            'LIMIT': 'limit',
            'STOP_LIMIT': 'limit',
            'MARKET': 'market',
        };
        const feeCostString = this.safeString (trade, 'fee');
        let fee: FeeString = undefined;
        if (feeCostString !== undefined) {
            fee = {
                'cost': feeCostString,
                'currency': this.safeCurrencyCode (this.safeString (trade, 'fee_currency')),
                'rate': this.safeString (trade, 'fee_rate'),
            };
        }
        return this.safeTrade ({
            'id': this.safeString2 (trade, 'trade_id', 'id'),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'order': this.safeString (trade, 'order_id'),
            'symbol': marketResolved['symbol'],
            'type': this.safeString (types, orderType),
            'side': side,
            'takerOrMaker': takerOrMaker,
            'price': this.safeString (trade, 'price'),
            'amount': this.safeString (trade, 'qty'),
            'cost': undefined,
            'fee': fee,
        }, marketResolved);
    }

    /**
     * @method
     * @name coinone#fetchTrades
     * @description get the list of most recent trades for a particular symbol
     * @see https://docs.coinone.co.kr/reference/recent-completed-orders
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/?id=public-trades}
     */
    override async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params: Dict = {}): Promise<Trade[]> {
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const market = this.market (symbol);
        const request: Dict = {
            'quote_currency': market['quote'],
            'target_currency': market['base'],
        };
        if (limit !== undefined) {
            request['size'] = Math.min (limit, 200);
        }
        const response = await this.v2PublicGetTradesQuoteCurrencyTargetCurrency (this.extend (request, params));
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "server_time": 1701075315771,
        //         "quote_currency": "KRW",
        //         "target_currency": "BTC",
        //         "transactions": [
        //             {
        //                 "id": "1701075265708001",
        //                 "timestamp": 1701075265708,
        //                 "price": "50020000",
        //                 "qty": "0.00155177",
        //                 "is_seller_maker": false
        //             }
        //         ]
        //     }
        //
        const data: Dict[] = this.safeList (response, 'transactions', []);
        return this.parseTrades (data, market, since, limit);
    }

    /**
     * @method
     * @name coinone#createOrder
     * @description create a trade order
     * @see https://docs.coinone.co.kr/reference/order-place-limit-order
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type must be 'limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} price the price at which the order is to be fulfilled, in units of the quote currency, required for the limit orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/?id=order-structure}
     */
    override async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params: Dict = {}): Promise<Order> {
        const orderType = (type as string).toUpperCase (); // unified lowercase order types, uppercase exchange-specific overrides accepted as-is
        const orderSide = (side as string).toUpperCase (); // unified lowercase order sides, same override rule
        if (orderType !== 'LIMIT') {
            throw new ExchangeError (this.id + ' createOrder() allows limit orders only');
        }
        if (price === undefined) {
            throw new ArgumentsRequired (this.id + ' createOrder() requires a price argument for the limit orders');
        }
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const market = this.market (symbol);
        // the v1 order/limit_buy and order/limit_sell endpoints were retired by
        // the exchange and return 404, the v2.1 order endpoint replaces them,
        // see https://github.com/ccxt/ccxt/issues/23174
        const request: Dict = {
            'quote_currency': market['quoteId'],
            'target_currency': market['baseId'],
            'type': orderType,
            'side': orderSide,
            'price': this.priceToPrecision (symbol, price),
            'qty': this.amountToPrecision (symbol, amount),
        };
        const response = await this.v2_1PrivatePostOrderLimit (this.extend (request, params));
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "order_id": "8a82c561-40b4-4cb3-9bc0-9ac9ffc1d63b"
        //     }
        //
        return this.parseOrder (response, market);
    }

    /**
     * @method
     * @name coinone#fetchOrder
     * @description fetches information on an order made by the user
     * @see https://docs.coinone.co.kr/reference/order-detail
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.clientOrderId] the user_order_id of the order, used instead of id
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/?id=order-structure}
     */
    override async fetchOrder (id: string, symbol: Str = undefined, params: Dict = {}): Promise<Order> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrder() requires a symbol argument');
        }
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const market = this.market (symbol);
        const request: Dict = {
            'quote_currency': market['quoteId'],
            'target_currency': market['baseId'],
        };
        const clientOrderId = this.safeString2 (params, 'clientOrderId', 'user_order_id');
        if (clientOrderId !== undefined) {
            request['user_order_id'] = clientOrderId;
        } else {
            request['order_id'] = id;
        }
        const query = this.omit (params, [ 'clientOrderId', 'user_order_id' ]);
        const response = await this.v2_1PrivatePostOrderDetail (this.extend (request, query));
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "order": {
        //             "order_id": "0f1c26d0-1e4d-11e9-9ec7-00e04c3600d7",
        //             "type": "LIMIT",
        //             "quote_currency": "KRW",
        //             "target_currency": "BTC",
        //             "status": "CANCELED",
        //             "side": "BUY",
        //             "fee": "0",
        //             "fee_rate": "0.0",
        //             "average_executed_price": "0",
        //             "updated_at": 1680055490000,
        //             "ordered_at": 1680051059000,
        //             "price": "100000",
        //             "original_qty": "1",
        //             "executed_qty": "0",
        //             "canceled_qty": "1",
        //             "remain_qty": "0",
        //             "limit_price": null,
        //             "traded_amount": null,
        //             "original_amount": null,
        //             "canceled_amount": null,
        //             "is_triggered": null,
        //             "trigger_price": null
        //         }
        //     }
        //
        const order = this.safeDict (response, 'order', {});
        return this.parseOrder (order, market);
    }

    parseOrderStatus (status: Str): Str {
        const statuses: Dict = {
            'LIVE': 'open',
            'PARTIALLY_FILLED': 'open',
            'NOT_TRIGGERED': 'open',
            'TRIGGERED': 'open',
            'FILLED': 'closed',
            'CANCELED': 'canceled',
            'PARTIALLY_CANCELED': 'canceled',
            'NOT_TRIGGERED_CANCELED': 'canceled',
            'NOT_TRIGGERED_PARTIALLY_CANCELED': 'canceled',
            'CANCELED_NO_ORDER': 'canceled',
            'CANCELED_LIMIT_PRICE_EXCEED': 'canceled',
            'CANCELED_UNDER_PRODUCT_UNIT': 'canceled',
        };
        return this.safeString (statuses, (status as string), status);
    }

    override parseOrder (order: Dict, market: Market = undefined): Order {
        //
        // createOrder
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "order_id": "8a82c561-40b4-4cb3-9bc0-9ac9ffc1d63b"
        //     }
        //
        // fetchOrder (market buy)
        //
        //     {
        //         "order_id": "0f9d1473-1e4d-11e9-9ec7-00e04c3600d7",
        //         "type": "MARKET",
        //         "quote_currency": "KRW",
        //         "target_currency": "BTC",
        //         "status": "CANCELED_UNDER_PRODUCT_UNIT",
        //         "side": "BUY",
        //         "fee": "1999.9999",
        //         "average_fee_rate": "0.002",
        //         "average_executed_price": "29959000",
        //         "updated_at": 1686133903000,
        //         "ordered_at": 1686133903000,
        //         "price": null,
        //         "original_qty": null,
        //         "executed_qty": "0.03337895",
        //         "canceled_qty": null,
        //         "remain_qty": null,
        //         "limit_price": "40000000",
        //         "traded_amount": "999999.963",
        //         "original_amount": "1000000",
        //         "canceled_amount": "0.0369",
        //         "is_triggered": null,
        //         "trigger_price": null
        //     }
        //
        // fetchOpenOrders
        //
        //     {
        //         "order_id": "0f5122d8-1e4d-11e9-9ec7-00e04c3600d7",
        //         "type": "STOP_LIMIT",
        //         "quote_currency": "KRW",
        //         "target_currency": "ETH",
        //         "price": "35000000",
        //         "remain_qty": "1",
        //         "original_qty": "1",
        //         "canceled_qty": "0",
        //         "executed_qty": "0",
        //         "side": "SELL",
        //         "fee": "0",
        //         "fee_rate": "0.0",
        //         "average_executed_price": "0",
        //         "ordered_at": 1682382211000,
        //         "is_triggered": false,
        //         "trigger_price": "37000000",
        //         "triggered_at": null
        //     }
        //
        // cancelOrder
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "order_id": "d85cc6af-b131-4398-b269-ddbafa760a39",
        //         "price": "26231000.0",
        //         "qty": "0.002",
        //         "remain_qty": "0.0",
        //         "side": "BUY",
        //         "original_qty": "0.005",
        //         "traded_qty": "0.003",
        //         "canceled_qty": "0.002",
        //         "fee": "26231.0",
        //         "fee_rate": "0.001",
        //         "avg_price": "26231000.0",
        //         "canceled_at": 1650525935,
        //         "ordered_at": 1650125935
        //     }
        //
        const baseId = this.safeString (order, 'target_currency');
        const quoteId = this.safeString (order, 'quote_currency');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        let symbol: Str = undefined;
        if ((base !== undefined) && (quote !== undefined)) {
            symbol = base + '/' + quote;
        }
        const marketResolved = (symbol !== undefined) ? this.safeMarket (symbol, market, '/') : this.safeMarket (undefined, market);
        let timestamp: Int = undefined;
        let lastUpdateTimestamp: Int = undefined;
        let status = this.parseOrderStatus (this.safeString (order, 'status'));
        const canceledAt = this.safeString (order, 'canceled_at');
        if (canceledAt !== undefined) {
            // the cancel response is the only one documented in seconds, the others use milliseconds
            timestamp = this.safeTimestamp (order, 'ordered_at');
            lastUpdateTimestamp = this.safeTimestamp (order, 'canceled_at');
            status = 'canceled';
        } else {
            timestamp = this.safeInteger (order, 'ordered_at');
            lastUpdateTimestamp = this.safeInteger (order, 'updated_at');
        }
        const orderType = this.safeString (order, 'type');
        let type: Str = undefined;
        if ((orderType === 'LIMIT') || (orderType === 'STOP_LIMIT')) {
            type = 'limit';
        } else if (orderType === 'MARKET') {
            type = 'market';
        }
        let average = this.safeString2 (order, 'average_executed_price', 'avg_price');
        if ((average !== undefined) && Precise.stringEq (average, '0')) {
            average = undefined; // the exchange sends 0 for orders without fills
        }
        let fee: FeeString = undefined;
        const feeCostString = this.safeString (order, 'fee');
        if (feeCostString !== undefined) {
            fee = {
                'cost': feeCostString,
                'rate': this.safeString2 (order, 'fee_rate', 'average_fee_rate'),
                'currency': (marketResolved !== undefined) ? marketResolved['quote'] : quote,
            };
        }
        return this.safeOrder ({
            'info': order,
            'id': this.safeString (order, 'order_id'),
            'clientOrderId': this.safeString (order, 'user_order_id'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': undefined,
            'lastUpdateTimestamp': lastUpdateTimestamp,
            'symbol': marketResolved['symbol'],
            'type': type,
            'timeInForce': undefined,
            'postOnly': undefined,
            'side': this.safeStringLower (order, 'side'),
            'price': this.safeString (order, 'price'),
            'triggerPrice': this.safeString (order, 'trigger_price'),
            'cost': this.safeString (order, 'traded_amount'),
            'average': average,
            'amount': this.safeString (order, 'original_qty'),
            'filled': this.safeString2 (order, 'executed_qty', 'traded_qty'),
            'remaining': this.safeString (order, 'remain_qty'),
            'status': status,
            'fee': fee,
            'trades': undefined,
        }, marketResolved);
    }

    /**
     * @method
     * @name coinone#fetchOpenOrders
     * @description fetch all unfilled currently open orders
     * @see https://docs.coinone.co.kr/reference/find-active-orders
     * @param {string} [symbol] unified market symbol, all markets are returned if not set
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of  open orders structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string[]} [params.order_type] filter by order types, 'LIMIT', 'STOP_LIMIT'
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/?id=order-structure}
     */
    override async fetchOpenOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params: Dict = {}): Promise<Order[]> {
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        let market: Market = undefined;
        const request: Dict = {};
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['quote_currency'] = market['quoteId'];
            request['target_currency'] = market['baseId'];
        }
        const response = await this.v2_1PrivatePostOrderActiveOrders (this.extend (request, params));
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "active_orders": [
        //             {
        //                 "order_id": "0f460777-1e4d-11e9-9ec7-00e04c3600d7",
        //                 "type": "LIMIT",
        //                 "quote_currency": "KRW",
        //                 "target_currency": "BTT",
        //                 "price": "0.0009",
        //                 "remain_qty": "10000000",
        //                 "original_qty": "10000000",
        //                 "canceled_qty": "0",
        //                 "executed_qty": "0",
        //                 "side": "BUY",
        //                 "fee": "0",
        //                 "fee_rate": "0.0",
        //                 "average_executed_price": "0",
        //                 "ordered_at": 1682058807000,
        //                 "is_triggered": null,
        //                 "trigger_price": null,
        //                 "triggered_at": null
        //             }
        //         ]
        //     }
        //
        const activeOrders = this.safeList (response, 'active_orders', []);
        return this.parseOrders (activeOrders, market, since, limit, { 'status': 'open' });
    }

    /**
     * @method
     * @name coinone#fetchMyTrades
     * @description fetch all trades made by the user
     * @see https://docs.coinone.co.kr/reference/find-completed-orders
     * @see https://docs.coinone.co.kr/reference/find-all-completed-orders
     * @param {string} [symbol] unified market symbol, trades of all markets are returned if not set
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve, max 100
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch trades for, the range between since and until can be 90 days at most
     * @param {string} [params.to_trade_id] fetch the trades before this trade id
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/?id=trade-structure}
     */
    override async fetchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params: Dict = {}): Promise<Trade[]> {
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const maxRange = 90 * 24 * 60 * 60 * 1000;
        let until = this.safeInteger (params, 'until');
        if (until === undefined) {
            until = this.milliseconds ();
            if (since !== undefined) {
                until = Math.min (this.sum (since, maxRange), until);
            }
        }
        let fromTs = since;
        if (fromTs === undefined) {
            fromTs = until - maxRange;
        }
        let size = 100;
        if (limit !== undefined) {
            size = Math.min (limit, 100);
        }
        const request: Dict = {
            'size': size,
            'from_ts': fromTs,
            'to_ts': until,
        };
        const query = this.omit (params, 'until');
        let market: Market = undefined;
        let response = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['quote_currency'] = market['quoteId'];
            request['target_currency'] = market['baseId'];
            response = await this.v2_1PrivatePostOrderCompletedOrders (this.extend (request, query));
        } else {
            response = await this.v2_1PrivatePostOrderCompletedOrdersAll (this.extend (request, query));
        }
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "completed_orders": [
        //             {
        //                 "trade_id": "0e2bb80f-1e4d-11e9-9ec7-00e04c3600d1",
        //                 "order_id": "0e2b9627-1e4d-11e9-9ec7-00e04c3600d2",
        //                 "quote_currency": "KRW",
        //                 "target_currency": "BTC",
        //                 "order_type": "LIMIT",
        //                 "is_ask": true,
        //                 "is_maker": true,
        //                 "price": "8420",
        //                 "qty": "0.1599",
        //                 "timestamp": 1761300000000,
        //                 "fee_rate": "0.001",
        //                 "fee": "162",
        //                 "fee_currency": "KRW"
        //             }
        //         ]
        //     }
        //
        const completedOrders = this.safeList (response, 'completed_orders', []);
        return this.parseTrades (completedOrders, market, since, limit);
    }

    /**
     * @method
     * @name coinone#cancelOrder
     * @description cancels an open order
     * @see https://docs.coinone.co.kr/reference/cancel-order
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.clientOrderId] the user_order_id of the order, used instead of id
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/?id=order-structure}
     */
    override async cancelOrder (id: string, symbol: Str = undefined, params: Dict = {}): Promise<Order> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
        }
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const market = this.market (symbol);
        const request: Dict = {
            'quote_currency': market['quoteId'],
            'target_currency': market['baseId'],
        };
        const clientOrderId = this.safeString2 (params, 'clientOrderId', 'user_order_id');
        if (clientOrderId !== undefined) {
            request['user_order_id'] = clientOrderId;
        } else {
            request['order_id'] = id;
        }
        const query = this.omit (params, [ 'clientOrderId', 'user_order_id' ]);
        const response = await this.v2_1PrivatePostOrderCancel (this.extend (request, query));
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "order_id": "d85cc6af-b131-4398-b269-ddbafa760a39",
        //         "price": "26231000.0",
        //         "qty": "0.002",
        //         "remain_qty": "0.0",
        //         "side": "BUY",
        //         "original_qty": "0.005",
        //         "traded_qty": "0.003",
        //         "canceled_qty": "0.002",
        //         "fee": "26231.0",
        //         "fee_rate": "0.001",
        //         "avg_price": "26231000.0",
        //         "canceled_at": 1650525935,
        //         "ordered_at": 1650125935
        //     }
        //
        return this.parseOrder (response, market);
    }

    /**
     * @method
     * @name coinone#cancelAllOrders
     * @description cancel all open orders in a market
     * @see https://docs.coinone.co.kr/reference/cancel-orders
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/?id=order-structure}, the exchange returns only the number of canceled orders
     */
    override async cancelAllOrders (symbol: Str = undefined, params: Dict = {}): Promise<Order[]> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelAllOrders() requires a symbol argument');
        }
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const market = this.market (symbol);
        const request: Dict = {
            'quote_currency': market['quoteId'],
            'target_currency': market['baseId'],
        };
        const response = await this.v2_1PrivatePostOrderCancelAll (this.extend (request, params));
        //
        //     {
        //         "result": "success",
        //         "error_code": "0",
        //         "canceled_count": 15,
        //         "total_order_count": 15
        //     }
        //
        return [
            this.safeOrder ({
                'info': response,
            }),
        ];
    }

    /**
     * @method
     * @name coinone#fetchDepositAddresses
     * @description fetch deposit addresses for multiple currencies and chain types
     * @param {string[]|undefined} codes list of unified currency codes, default is undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a list of [address structures]{@link https://docs.ccxt.com/?id=address-structure}
     */
    override async fetchDepositAddresses (codes: Strings = undefined, params: Dict = {}): Promise<DepositAddress[]> {
        if (this.markets === undefined) {
            await this.loadMarkets ();
        }
        const response = await this.v2PrivatePostAccountDepositAddress (params);
        //
        //     {
        //         "result": "success",
        //         "errorCode": "0",
        //         "walletAddress": {
        //             "matic": null,
        //             "btc": "mnobqu4i6qMCJWDpf5UimRmr8JCvZ8FLcN",
        //             "xrp": null,
        //             "xrp_tag": "-1",
        //             "kava": null,
        //             "kava_memo": null,
        //         }
        //     }
        //
        const walletAddress = this.safeDict (response, 'walletAddress', {});
        const keys = Object.keys (walletAddress);
        const result: Dict = {};
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.safeString (walletAddress, key);
            if ((value === undefined) || (value === null) || (value === '') || (value === '-1')) {
                continue;
            }
            const parts = key.split ('_');
            const currencyId = this.safeString (parts, 0);
            const secondPart = this.safeString (parts, 1);
            const code = this.safeCurrencyCode (currencyId);
            const address = this.safeString (this.safeValue (result, code), 'address', value);
            this.checkAddress (address);
            const depositAddress: Dict = {
                'info': address,
                'currency': code,
                'network': undefined,
                'address': address,
                'tag': this.safeString (this.safeValue (result, code), 'tag'),
            };
            if ((secondPart === 'tag' || secondPart === 'memo')) {
                depositAddress['tag'] = value;
                depositAddress['info'] = [ address, value ];
            }
            if (code !== undefined) {
                result[code] = depositAddress;
            }
        }
        return this.toArray (result);
    }

    override sign (path: string, api: string[] = [ 'public' ], method: string = 'GET', params: Dict = {}): Dict {
        const apiName = api[0];
        const request = this.implodeParams (path, params);
        const query = this.omit (params, this.extractParams (path));
        const apiUrl = this.safeString (this.urls['api'], 'rest');
        if (apiUrl === undefined) {
            throw new ExchangeError (this.id + ' sign() has no API URL for this endpoint');
        }
        let url = apiUrl + '/';
        const isPublic = (apiName === 'public') || (apiName === 'v2Public');
        if (apiName === 'v2Public') {
            const apiUrl2 = this.safeString (this.urls['api'], 'v2Public');
            if (apiUrl2 === undefined) {
                throw new ExchangeError (this.id + ' sign() has no API URL for this endpoint');
            }
            url = apiUrl2 + '/';
        } else if (apiName === 'v2Private') {
            const apiUrl3 = this.safeString (this.urls['api'], 'v2Private');
            if (apiUrl3 === undefined) {
                throw new ExchangeError (this.id + ' sign() has no API URL for this endpoint');
            }
            url = apiUrl3 + '/';
        } else if (apiName === 'v2_1Private') {
            const apiUrl4 = this.safeString (this.urls['api'], 'v2_1Private');
            if (apiUrl4 === undefined) {
                throw new ExchangeError (this.id + ' sign() has no API URL for this endpoint');
            }
            url = apiUrl4 + '/';
        }
        let requestBody: Str = undefined;
        let requestHeaders: NullableDict = undefined;
        if (isPublic) {
            url += request;
            if (Object.keys (query).length > 0) {
                url += '?' + this.urlencode (query);
            }
        } else {
            this.checkRequiredCredentials ();
            url += request;
            // the v2.1 api requires a uuid nonce, the older apis use a numeric one
            let nonce: Str = undefined;
            if (apiName === 'v2_1Private') {
                nonce = this.uuid ();
            } else {
                nonce = this.numberToString (this.nonce ());
            }
            const json = this.json (this.extend ({
                'access_token': this.apiKey,
                'nonce': nonce,
            }, params));
            const payload = this.stringToBase64 (json);
            // the server authenticates the X-COINONE-PAYLOAD header, the body carries the same json
            requestBody = json;
            const secret = this.secret.toUpperCase ();
            const signature = this.hmac (this.encode (payload), this.encode (secret), sha512);
            requestHeaders = {
                'Content-Type': 'application/json',
                'X-COINONE-PAYLOAD': payload,
                'X-COINONE-SIGNATURE': signature,
            };
        }
        const bodyResolved = requestBody;
        const headersResolved = requestHeaders;
        return { 'url': url, 'method': method, 'body': bodyResolved, 'headers': headersResolved };
    }

    override handleErrors (code: int, reason: string, url: string, method: string, headers: Dict, body: string, response: any, requestHeaders: NullableDict, requestBody: Str) {
        if (response === undefined) {
            return undefined; // fallback to default error handler
        }
        //
        //     {"result":"error","error_code":"107","error_msg":"Parameter value is wrong"}
        //     {"result":"error","error_code":"108","error_msg":"Unknown CryptoCurrency"}
        //
        const errorCode = this.safeString (response, 'error_code');
        if (errorCode !== undefined && errorCode !== '0') {
            const feedback = this.id + ' ' + body;
            this.throwExactlyMatchedException (this.exceptions, errorCode, feedback);
            throw new ExchangeError (feedback); // unknown message
        }
        return undefined;
    }
}
