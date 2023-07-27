pragma ever-solidity >= 0.61.2;

import "../structures/IMarketFeeStructure.sol";
import "../structures/IMarketBurnFeeStructure.sol";

interface IEventsMarketFeeOffer is IMarketFeeStructure, IMarketBurnFeeStructure {

    event MarketFeeChanged(address auction, MarketFee fee);
    event MarketBurnFeeChanged(address auction, optional(MarketBurnFee) fee);
    event MarketFeeWithheld(uint128 amount, address tokenRoot);
}