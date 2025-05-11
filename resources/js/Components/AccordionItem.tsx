import { formattedNumber } from "@/utils/formatNumber";
import { renderHTML } from "@/utils/renderHtml";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import Checkbox from "./Checkbox";
import Modal from "./Modal";

const AccordionItem = ({
    productItems,
    proposalItems,
    handleProposalItemChanged,
    handleItemQtyChange,
    distance,
    proposalStatus,
    calculate,
}: any) => {
    const calculatePrice = (
        itemType: string,
        unit: string,
        additional: string
    ) => {
        let value =
            itemType === "TRANSPORTATION" && calculate
                ? roundToNearest50(
                      parseFloat(unit) +
                          parseFloat(additional) *
                              Math.round(parseInt(distance) / 1000)
                  )
                : parseFloat(unit);

        return value;
        // return value;
    };

    const roundToNearest50 = (value: number) => {
        return Math.ceil(value / 50) * 50;
    };

    const handleAddItem = (
        e: React.ChangeEvent<HTMLInputElement>,
        item: any
    ) => {
        let newItem = item;
        if (item.item_type === "TRANSPORTATION") {
            newItem = {
                ...item,
                unit_price: calculate
                    ? roundToNearest50(
                          parseFloat(item.unit_price) +
                              parseFloat(item.additional_unit_cost) *
                                  Math.round(parseInt(distance) / 1000)
                      )
                    : parseFloat(item.unit_price),
            };
        }
        handleProposalItemChanged(e, newItem);
    };

    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    return productItems.map((m: any) => {
        return (
            <div key={m.item_id} className="py-2">
                <Modal
                    maxWidth="md"
                    show={showImageModal}
                    closeable={true}
                    onClose={() => setShowImageModal(false)}
                >
                    <img src={selectedImage} alt="" className="w-full" />
                </Modal>
                {(proposalItems.find((i: any) => i.item_id === m.item_id) ||
                    m.item_status === 0) && (
                    <div>
                        <div className="flex flex-col px-2 md:flex-row md:justify-between">
                            <div className="flex flex-row items-center gap-2">
                                <Checkbox
                                    name="checkbox"
                                    checked={
                                        proposalItems.find(
                                            (i: any) => i.item_id === m.item_id
                                        )
                                            ? true
                                            : false
                                    }
                                    onChange={(e) => {
                                        handleAddItem(e, m);
                                    }}
                                    className="align-top"
                                />

                                <div className="align-bottom">
                                    <div className="flex w-full flex-row justify-between md:grid md:max-w-80 md:grid-cols-5 md:gap-2">
                                        <div className="flex items-center pr-4 md:col-span-4">
                                            <span className="font-semibold">
                                                {m.item_name}
                                            </span>
                                        </div>
                                        {/* {m.item_image &&
                                            m.item_type === "FOOD" && (
                                                <div className="md:col-span-1flex cursor-pointer justify-end">
                                                    <img
                                                        src={m.url}
                                                        alt=""
                                                        className="h-12 w-14 object-contain"
                                                        onClick={() => {
                                                            setSelectedImage(
                                                                m.url
                                                            );
                                                            setShowImageModal(
                                                                true
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            )} */}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row justify-end gap-2">
                                {proposalItems.find(
                                    (p: any) => p.item_id === m.item_id
                                ) ? (
                                    <div className="mr-2 flex flex-row items-center gap-2">
                                        <div>
                                            <button
                                                className="rounded-md bg-gray-200 px-2 py-2"
                                                onClick={() =>
                                                    handleItemQtyChange(
                                                        m.item_id,
                                                        "minus"
                                                    )
                                                }
                                            >
                                                <Minus />
                                            </button>
                                        </div>
                                        <span className="px-2 text-lg font-bold">
                                            {proposalItems.find(
                                                (i: any) =>
                                                    i.item_id === m.item_id
                                            )
                                                ? proposalItems.map(
                                                      (i: any) => {
                                                          if (
                                                              i.item_id ===
                                                              m.item_id
                                                          ) {
                                                              return i.item_qty;
                                                          }
                                                      }
                                                  )
                                                : 1}
                                        </span>
                                        <div>
                                            <button
                                                className="rounded-md bg-gray-200 px-2 py-2"
                                                onClick={() =>
                                                    handleItemQtyChange(
                                                        m.item_id,
                                                        "add"
                                                    )
                                                }
                                            >
                                                <Plus />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="flex items-center">
                                    {proposalItems.find(
                                        (i: any) => i.item_id === m.item_id
                                    ) ? (
                                        proposalItems.map((i: any) => {
                                            if (i.item_id === m.item_id) {
                                                return (
                                                    <span key={i.item_id}>
                                                        {proposalStatus === 0
                                                            ? formattedNumber(
                                                                  calculatePrice(
                                                                      i.item_type,
                                                                      i.unit_price,
                                                                      i.additional_unit_cost
                                                                  )
                                                              )
                                                            : formattedNumber(
                                                                  i.unit_price
                                                              )}{" "}
                                                        / {i.uom}
                                                    </span>
                                                );
                                            }
                                        })
                                    ) : (
                                        <span>
                                            {formattedNumber(
                                                calculatePrice(
                                                    m.item_type,
                                                    m.unit_price,
                                                    m.additional_unit_cost
                                                )
                                            )}{" "}
                                            / {m.uom}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="text-lg font-bold">
                                        {proposalItems.find(
                                            (i: any) => i.item_id === m.item_id
                                        )
                                            ? proposalItems.map((i: any) => {
                                                  if (i.item_id === m.item_id) {
                                                      if (
                                                          proposalStatus === 0
                                                      ) {
                                                          return formattedNumber(
                                                              i.item_qty *
                                                                  calculatePrice(
                                                                      i.item_type,
                                                                      i.unit_price,
                                                                      i.additional_unit_cost
                                                                  )
                                                          );
                                                      } else {
                                                          return formattedNumber(
                                                              i.item_qty *
                                                                  i.unit_price
                                                          );
                                                      }
                                                  }
                                              })
                                            : ""}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-[80%] pl-8 md:max-w-[60%]">
                            {m.item_description && (
                                <span className="text-xs">
                                    {renderHTML(m.item_description)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    });
};

export default AccordionItem;
