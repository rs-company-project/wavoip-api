export const checkReponseResult = (response) => {
    if(typeof response !== "object") {
        console.error("[CHECKRESPONSE] - Resposta inesperada do servidor", response);
        return false;
    }

    if(response?.type === "success") {
        return true;
    }
    else {
        return false;
    }
}