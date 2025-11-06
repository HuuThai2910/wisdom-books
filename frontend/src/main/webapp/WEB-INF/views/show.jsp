<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<h2>Danh sách data backend trả về:</h2>

<ul>
    <c:forEach items="${items}" var="i">
        <li>${i}</li>
    </c:forEach>
</ul>
