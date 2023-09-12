pragma ever-solidity >= 0.61.2;

import "../../errors/BaseErrors.sol";
import "../../interfaces/IEventsMarketFeeOffer.sol";
import "../../abstract/BaseRoot.sol";
import "./MarketBurnFeeOffer.sol";
import "../../libraries/Gas.sol";
import "./MarketFeeRoot.sol";

abstract contract MarketBurnFeeRoot is MarketFeeRoot {

    function setMarketBurnFee(
        MarketBurnFee _fee
    )
        external
        onlyOwner
        reserve
    {
        require(_fee.denominator > 0, BaseErrors.denominator_not_be_zero);
        _setMarketBurnFee(_fee);
        msg.sender.transfer({ value: 0, flag: 128 + 2, bounce: false });
    }

    function setMarketBurnFeeForChildContract(
        address _offer,
        MarketBurnFee _fee
    )
        external
        onlyOwner
    {
        require(_fee.denominator > 0, BaseErrors.denominator_not_be_zero);
        MarketBurnFeeOffer(_offer).setMarketBurnFee{value: 0, flag: 64, bounce: false}(_fee, msg.sender);
        emit MarketBurnFeeChanged(_offer, _fee);
    }

    function marketBurnFee()
        external
        view
        returns (optional(MarketBurnFee))
    {
        return _getMarketBurnFee();
    }
}